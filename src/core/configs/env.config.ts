import { ConfigModuleOptions } from '@nestjs/config';
import * as joi from 'joi';

export const envOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  validationSchema: joi.object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
  }),
  isGlobal: true,
};
