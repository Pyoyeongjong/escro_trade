import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction } from "typeorm";

export class TransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>
    ){}
}