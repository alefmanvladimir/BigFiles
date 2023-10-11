import { Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';

export function parseCreateCmdOutput(out: string): string | null {
  if (out.indexOf('Bag created') == -1) {
    return null;
  }
  const regex = /BagID = (?<bagId>.{64})/;
  const res = out.match(regex);

  return res ? res.groups['bagId'] : null;
}
// STORAGE_CLI_EXEC_PATH=./ton-win-x86-64/storage-daemon-cli.exe
// STORAGE_WORK_DIR=C:\Users\User_Name\Folder
// USE_SHELL=false
@Injectable()
export class TonStorageService {
  async createBag(filePath1: string): Promise<{ bagId: string } | string> {
    const filePath = filePath1.replace(/\\/g, '/');
    console.log('FILE PATH', filePath);

    const ls = spawn(`${process.env.STORAGE_CLI_EXEC_PATH}`, ['-I', '127.0.0.1:5555', '-k', 'storage-db/cli-keys/client', '-p', 'storage-db/cli-keys/server.pub', '-c', `\"create -d CreatedFromNest '${filePath}'\"`], {
      cwd: `${process.env.STORAGE_WORK_DIR}`,
      shell: process.env.USE_SHELL === 'true',
      windowsVerbatimArguments: true,
    });

    return new Promise((resolve, reject) => {
      let consoleOut = null;

      ls.stdout.on('data', (data) => {
        console.log(`DATA: ${data}`);
        if (consoleOut == null) {
          consoleOut = data.toString();
        } else {
          consoleOut = consoleOut + data.toString();
        }
      });

      ls.stderr.on('data', (data) => {
        console.log(`ERR: ${data}`);
      });

      ls.on('close', (code) => {
        if (code != 0) {
          reject('Failed');
        }
        const bagId = parseCreateCmdOutput(consoleOut.toString());
        if (bagId) {
          resolve({ bagId });
        } else {
          reject('Failed to parse');
        }
      });
    });
  }

  async createContract(bagId: string, providerAddress: string): Promise<NodeJS.ArrayBufferView> {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-contract'));
    const file = path.join(tempDir, 'provider-response');

    const ls = spawn(`${process.env.STORAGE_CLI_EXEC_PATH}`, ['-I', '127.0.0.1:5555', '-k', 'storage-db/cli-keys/client', '-p', 'storage-db/cli-keys/server.pub', '-c', `\"new-contract-message ${bagId} ${file.replace(/\\/g, '/')} --provider ${providerAddress}\"`], {
      cwd: `${process.env.STORAGE_WORK_DIR}`,
      shell: process.env.USE_SHELL === 'true',
      windowsVerbatimArguments: true,
    });

    return new Promise((resolve, reject) => {
      ls.stdout.on('data', (data) => {
        console.log(`DATA: ${data}`);
      });

      ls.stderr.on('data', (data) => {
        console.log(`ERR: ${data}`);
      });

      ls.on('close', (code) => {
        if (code != 0) {
          reject('Failed');
        } else {
          resolve(fs.readFileSync(file));
        }
      });
    });
  }
}
