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

  async createBag(filePath1: string): Promise<{ bagId: string } | string> {
    const filePath = filePath1.replace(/\\/g, '/');
    console.log('FILE PATH', filePath);

    const cliResponse = await this.execCliCommand(`\"create -d CreatedFromNest '${filePath}'\"`);

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

    await this.execCliCommand(`\"new-contract-message ${bagId} ${file.replace(/\\/g, '/')} --provider ${providerAddress}\"`);

    return fs.readFile(file);
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
      let consoleOut: string[] = [];

      ls.stdout.on('data', (data) => {
        console.log(`DATA: ${data}`);
        consoleOut.push(data.toString());
      });

      ls.stderr.on('data', (data) => {
        console.error(`ERR: ${data}`);
      });

      ls.on('close', (code) => {
        if (code != 0) {
          reject('Failed');
        }
        resolve(consoleOut.join(''));
      });
    });
  }
}
