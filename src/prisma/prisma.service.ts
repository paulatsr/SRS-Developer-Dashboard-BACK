import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Connect to the database when the module is initialized
  async onModuleInit() {
    await this.$connect();
  }
  // Disconnect from the database when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
