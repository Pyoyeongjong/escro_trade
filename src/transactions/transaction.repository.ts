import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionEntity } from "./transaction.entity";
import { ProductStatus } from "src/types/product-status";

@Injectable()
export class TransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>
    ) { }

    async createTransaction(txId: number, productId: number, cost: number, owner: string) {
        const transaction = this.transactionRepository.create({
            txId,
            productId,
            tx_type: "Normal",
            cost,
            owner,
            status: ProductStatus.PENDING
        });

        try {
            return await this.transactionRepository.save(transaction);
        } catch (error) {
            throw new InternalServerErrorException("Can't create a new Transaction");
        }
    }

    async findByTxId(txId: number) {
        const tx = await this.transactionRepository.findOne({
            where: { txId },
            relations: ['product', 'user']
        });
        if (!tx)
            throw new NotFoundException(`Transaction with ${txId} not found`);
        return tx;
    }

    async saveTx(transaction: TransactionEntity) {
        try {
            return await this.transactionRepository.save(transaction);
        } catch (err) {
            throw new InternalServerErrorException("Can't save TX");
        }
    }
}