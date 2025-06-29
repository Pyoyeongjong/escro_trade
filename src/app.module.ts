import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import configuration from './configs/configuration';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { ReplyModule } from './replies/reply.module';
import { TradeOfferModule } from './trade-offer/trade_offer.module';
import { TransactionModule } from './transactions/transaction.module';
import { TransactionListenerService } from './transfer-listener.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeORMConfig),
    AuthModule,
    ProductModule,
    UserModule,
    ReplyModule,
    TradeOfferModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService, TransactionListenerService],
})
export class AppModule { }
