import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(options: PrismaClientOptions) {
    super(options);
  }
  onModuleInit() {
    this.$connect();
  }
  onModuleDestroy() {
    this.$disconnect();
  }
  async truncate() {
    const records = await this.$queryRawUnsafe<Array<any>>(`SELECT tablename
                                                          FROM pg_tables
                                                          WHERE schemaname = 'public'`);
    records.forEach((record) => this.truncateTable(record['tablename']));
  }

  async truncateTable(tablename) {
    if (tablename === undefined || tablename === '_prisma_migrations') {
      return;
    }
    try {
      await this.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
      );
    } catch (error) {
      console.log({ error });
    }
  }

  async resetSequences() {
    const results = await this.$queryRawUnsafe<Array<any>>(
      `SELECT c.relname
       FROM pg_class AS c
                JOIN pg_namespace AS n ON c.relnamespace = n.oid
       WHERE c.relkind = 'S'
         AND n.nspname = 'public'`,
    );
    for (const { record } of results) {
      await this.$executeRawUnsafe(
        `ALTER SEQUENCE "public"."${record['relname']}" RESTART WITH 1;`,
      );
    }
  }
}
