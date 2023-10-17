import { ConfigModuleOptions } from '@nestjs/config';
import * as joi from 'joi';

export const envOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  validationSchema: joi.object({
    NODE_ENV: joi
      .string()
<<<<<<< HEAD
      .valid('development', 'production', 'test')
=======
      .valid('development', 'production')
>>>>>>> 918a961 (feature: add sign up, crypto module and some basic config)
      .default('development'),
  }),
  isGlobal: true,
};
