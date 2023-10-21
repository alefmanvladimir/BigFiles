import { Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';

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

    const cliResponse = await this.execCliCommand(`\"create -d CreatedFromNest '${this.pathToPosix(filePath)}'\"`);

    const bagId = TonStorageService.parseCreateCmdOutput(cliResponse);

    if (bagId) {
      return { bagId };
    } else {
      throw new Error('Failed to parse');
    }
  }

  async createContract(bagId: string, providerAddress: string): Promise<NodeJS.ArrayBufferView> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'create-contract'));
    const file = path.join(tempDir, 'provider-response');

    await this.execCliCommand(`\"new-contract-message ${bagId} ${this.pathToPosix(file)} --provider ${providerAddress}\"`);

    return fs.readFile(file);
  }

  /**
   *
   * Storage daemon doesn't run on Windows, so we need to convert path to posix format.
   *
   * @param pathToConvert
   * @returns path with posix separators
   */
  private pathToPosix(pathToConvert: string): string {
    return pathToConvert.split(path.sep).join(path.posix.sep);
  }

  private async getUploadedFilePath(fileName: string): Promise<string> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'upload'));
    return path.join(tempDir, fileName);
  }

  private execCliCommand(command: string): Promise<string> {
    const cliKeysDir = process.env.TON_STORAGE_KEYS_DIR || path.join(process.env.STORAGE_WORK_DIR, 'cli-keys');
    const cliClientKeyPath = path.join(cliKeysDir, 'client');
    const cliServerKeyPath = path.join(cliKeysDir, 'server.pub');
    const ls = spawn(
      `${process.env.STORAGE_CLI_EXEC_PATH}`,
      ['-I', `${this.TON_STORAGE_HOST}:5555`, '-k', cliClientKeyPath, '-p', cliServerKeyPath, '-c', command],
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
          reject(errorsOut.join(''));
        }
        resolve(consoleOut.join(''));
      });
    });
  }
}
