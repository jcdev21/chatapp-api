import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    console.info('connect prisma');
    this.$connect();
  }

  onModuleDestroy() {
    console.info('disconnect prisma');
    this.$disconnect();
  }
}
