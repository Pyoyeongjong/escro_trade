import { ForbiddenException, Injectable } from "@nestjs/common";
import { TransactionRepository } from "./transaction.repository";
import { ProductRepository } from "src/products/product.repository";
import { UserRepository } from "src/users/user.repository";
import { ProductStatus } from "src/types/product-status";

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository,
        private productRepository: ProductRepository,
        private userRepository: UserRepository
    ) { }

    // pname is pid in backend!
    async createNewTransaction(txId: number, productId: number, cost: number, owner: string) {
        const transaction = await this.transactionRepository.createTransaction(txId, productId, cost, owner);
        const product = await this.productRepository.findById(productId);
        product.transactions.push(transaction);

        const buyer = product.buyer;
        buyer.transactions.push(transaction);

        await this.productRepository.saveProduct(product);
        await this.userRepository.saveUser(buyer);
    }

    async cancelTransactinByTxId(txId: number) {
        const transaction = await this.transactionRepository.findByTxId(txId);
        transaction.status = ProductStatus.Canceled;
        await this.transactionRepository.saveTx(transaction);
    }

    async changeTransactionStatus(txId: number, pStatus: number) {
        const transaction = await this.transactionRepository.findByTxId(txId);
        let newStatus: ProductStatus;
        switch (pStatus) {
            case 0: newStatus = ProductStatus.PENDING; break;
            case 1: newStatus = ProductStatus.PROCESSING; break;
            case 2: newStatus = ProductStatus.SHIPPING; break;
            case 3: newStatus = ProductStatus.FINISHED; break;
            case 4: newStatus = ProductStatus.Canceled; break;
            default: throw new ForbiddenException("Invalid Status change");
        }
        transaction.status = newStatus;
        await this.transactionRepository.saveTx(transaction);
    }
}