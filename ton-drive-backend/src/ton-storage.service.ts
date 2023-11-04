import { Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';

interface PrepareDownloadResponse {
  ready: boolean
  exists: boolean
  filePath?: string
  _output?: string | object
}

@Injectable()
export class TonStorageService {

  private readonly TON_STORAGE_HOST = process.env.TON_STORAGE_HOST || '127.0.0.1'

  static parseCreateCmdOutput(out: string): string | null {
    if (out.indexOf('Bag created') == -1) {
      return null;
    }
    const regex = /BagID = (?<bagId>.{64})/;
    const res = out.match(regex);

    return res ? res.groups['bagId'] : null;
  }

  async createBag(file: Express.Multer.File): Promise<{ bagId: string } | string> {
    const filePath = await this.getUploadedFilePath(file.originalname);
    await fs.writeFile(filePath, file.buffer);
    console.log('FILE PATH', filePath);

    const cliPromise = this.execCliCommand(`\"create -d CreatedFromNest '${this.getStorageUploadedFilePath(filePath)}'\"`);
    cliPromise.catch((err) => {
      fs.rm(filePath);
    });
    const bagId = TonStorageService.parseCreateCmdOutput(await cliPromise);

    if (bagId) {
      return { bagId };
    } else {
      throw new Error('Failed to parse');
    }
  }

  async prepareDownload(bagId: string): Promise<PrepareDownloadResponse> {
    try {
      const cliRes = await this.execCliCommand(`\"get ${bagId} --json\"`)
      const cliResParsed = JSON.parse(cliRes);

      const noSuchTorrent = cliRes.match(/.+No such torrent/) !== null;
      // if bag not found, try to add it
      if (noSuchTorrent) {
        const output = await this.execCliCommand(`\"add-by-hash ${bagId}\"`)
        return {
          ready: false,
          exists: false,
          _output: output
        }
      }
      // if bag is found and ready to download
      if (cliResParsed["torrent"]?.active_upload) {
        const rootPath: string = cliResParsed["torrent"]['root_dir']
        const fileName: string = cliResParsed["files"][0]['name']
        return {
          ready: true,
          exists: true,
          filePath: path.join(rootPath, fileName).toString(),
          _output: cliResParsed
        };
      }
      // in any other case
      return {
        ready: false,
        exists: true,
        _output: cliResParsed
      }
    } catch (e) {
      if (e.data) {
        return {
          ready: false,
          exists: false,
          _output: e.data
        }
      } else {
        return Promise.reject(e)
      }
    }
  }

  async createContract(bagId: string, providerAddress: string): Promise<NodeJS.ArrayBufferView> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'create-contract'));
    const file = path.join(tempDir, 'provider-response');

    await this.execCliCommand(`\"new-contract-message ${bagId} ${this.pathToPosix(file)} --provider ${providerAddress}\"`);

    return fs.readFile(file);
  }

  private pathToPosix(pathToConvert: string): string {
    return pathToConvert.split(path.sep).join(path.posix.sep);
  }

  private async getUploadedFilePath(fileName: string): Promise<string> {
    // Recursive true is needed for cases when .upload already exists
    await fs.mkdir('.upload', { recursive: true })
    const tempDir = await fs.mkdtemp(path.join('.upload', 'session-'));
    return path.join(tempDir, fileName);
  }

  private getStorageUploadedFilePath(filepath: string): string {
    return this.pathToPosix(path.resolve(filepath))
  }

  private execCliCommand(command: string): Promise<string> {
    const ls = spawn(
      `${process.env.STORAGE_CLI_EXEC_PATH}`,
      ['-I', `${this.TON_STORAGE_HOST}:5555`, '-k', 'storage-db/cli-keys/client', '-p', 'storage-db/cli-keys/server.pub', '-c', command],
      {
        cwd: `${process.env.STORAGE_WORK_DIR}`,
        shell: process.env.USE_SHELL === 'true',
        windowsVerbatimArguments: true,
      }
    );

    return new Promise((resolve, reject) => {
      const consoleOut: string[] = [];
      const errorsOut: string[] = [];

      ls.stdout.on('data', (data) => {
        console.log(`DATA: ${data}`);
        consoleOut.push(data.toString());
      });

      ls.stderr.on('data', (data) => {
        errorsOut.push(data.toString());
      });

      ls.on('close', (code) => {
        if (code != 0) {
          reject({errors: errorsOut.join(''), data: consoleOut.join('')});
        }
        resolve(consoleOut.join(''));
      });
    });
  }
}
