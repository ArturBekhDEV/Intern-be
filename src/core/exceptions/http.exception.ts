import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse !== 'string' &&
        'message' in exceptionResponse &&
        exceptionResponse.message instanceof Array
      ) {
        response.status(status).json({
          status,
          message: exceptionResponse.message.join(', '),
        });
      } else {
        response
          .status(status)
          .json(
            typeof exceptionResponse === 'string'
              ? { status, exceptionResponse }
              : exceptionResponse,
          );
      }
    } else {
      if (this.configService.get('NODE_ENV') === 'development') {
        response.status(500).json({
          status: 500,
          message: exception.message,
        });
      } else {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
        });
        throw exception;
      }
    }
  }
}
