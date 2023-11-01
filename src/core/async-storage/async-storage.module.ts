import { ClsModule } from 'nestjs-cls';

import { Global, Module } from '@nestjs/common';
import { AsyncStorageService } from './async-storage.service';
import { clsOptions } from '@/core/configs/cls.config';

@Global()
@Module({
  imports: [ClsModule.forRoot(clsOptions)],
  providers: [AsyncStorageService],
  exports: [AsyncStorageService],
})
export class AsyncStorageModule {}
