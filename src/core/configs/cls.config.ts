import { ClsModuleOptions } from 'nestjs-cls';

export const clsOptions: ClsModuleOptions = {
  middleware: { mount: true },
  global: true,
};
