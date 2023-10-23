import { Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.tonStorageService.createBag(file);
  }

  @Post('contracts')
  async createNewContract(@Query('bagId') bagId: string, @Query('providerAddress') provider: string, @Res() response: Response) {
    const data = await this.tonStorageService.createContract(bagId, provider);
    response.send(data);
  }
}
