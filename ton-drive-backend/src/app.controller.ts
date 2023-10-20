import { Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { TonStorageService } from './ton-storage.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tonStorageService: TonStorageService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //Creates bag from file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'upload'));
    await fs.writeFile(`${tempDir}/${file.originalname}`, file.buffer);

    return this.tonStorageService.createBag(`${tempDir}/${file.originalname}`);
  }

  @Post('contracts')
  async createNewContract(@Query('bagId') bagId: string, @Query('providerAddress') provider: string, @Res() response: Response) {
    const data = await this.tonStorageService.createContract(bagId, provider);
    response.send(data);
  }
}
