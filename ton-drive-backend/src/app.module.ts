import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TonStorageService } from './ton-storage.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TonStorageService],
})
export class AppModule {}
