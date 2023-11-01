import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const pattern = /Unique constraint failed on the fields: \((.*?)\)/;
        const patternMatch = pattern.exec(exception.message);
        const message = patternMatch
          ? 'Unique constraint failed on the ' + patternMatch[1].split('`, `')
          : 'Unique constraint failed';
        response.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
