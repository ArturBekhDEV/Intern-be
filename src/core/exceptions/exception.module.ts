import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@core/exceptions/http.exception';
import { PrismaClientExceptionFilter } from '@/core/exceptions/prisma.exception';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
  ],
})
export class ExceptionModule {}
