import * as joi from 'joi';

export const envOptions = {
  envFilePath: '.env',
  validationSchema: joi.object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
  }),
  isGlobal: true,
};
