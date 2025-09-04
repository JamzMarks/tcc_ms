
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.connectWithRetry();
  }
  
  private async connectWithRetry(retries = 5, delay = 5000): Promise<void> {
    try {
      await this.$connect();
    } catch (error) {
      if(retries > 0){
        await new Promise(res => setTimeout(res, delay));
        await this.connectWithRetry(retries - 1, delay);
      }else{
        console.log('Prisma connection failed. Retrying in 5 seconds...', error);
        process.exit(1);
      }
    }
  }
}
