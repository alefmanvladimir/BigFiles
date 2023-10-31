import { BadRequestException, Controller, Get, Param, Post, Query, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TonStorageService } from './ton-storage.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from "path";

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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.tonStorageService.createBag(file);
  }

  @Post('contracts')
  async createNewContract(@Query('bagId') bagId: string, @Query('providerAddress') provider: string, @Res() response: Response) {
    const data = await this.tonStorageService.createContract(bagId, provider);
    response.send(data);
  }

  @Post('prepareDownload')
  async prepareDownload(@Query('bagId') bagId): Promise<{ ready: boolean, fileName?: string }> {
    const status = await this.tonStorageService.prepareDownload(bagId)
    if (status.ready) {
      return {
        ready: true,
        fileName: path.parse(status.filePath).base
      }
    } else {
      return {
        ready: false
      }
    }
  }

  @Get('download/:bagId/:fileName')
  async download(@Param('bagId') bagId: string, @Param('fileName') fileName: string) {
    const status = await this.tonStorageService.prepareDownload(bagId)
    if (!status.ready) {
      throw new BadRequestException("File not ready")
    }
    const file = createReadStream(status.filePath)
    return new StreamableFile(file)
  }
}
