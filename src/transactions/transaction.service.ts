import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./transaction.entity";
import { Repository } from "typeorm";
import { TransactionRepository } from "./transaction.repository";

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository
    ) {}
}