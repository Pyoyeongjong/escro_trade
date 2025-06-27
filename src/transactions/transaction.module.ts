import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./transaction.entity";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionRepository } from "./transaction.repository";

@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])],
    providers: [TransactionService, TransactionRepository],
    controllers: [TransactionController],
})
export class TransactionModule {}
