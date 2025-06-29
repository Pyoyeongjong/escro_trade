import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./transaction.entity";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionRepository } from "./transaction.repository";
import { UserModule } from "src/users/user.module";
import { ProductModule } from "src/products/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity]), UserModule, ProductModule],
    exports: [TransactionService],
    providers: [TransactionService, TransactionRepository],
    controllers: [TransactionController],
})
export class TransactionModule { }
