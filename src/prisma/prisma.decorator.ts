import { Inject } from '@nestjs/common';

export const PRISMA = Symbol('PRISMA');
export const InjectPrisma = () => Inject(PRISMA);
