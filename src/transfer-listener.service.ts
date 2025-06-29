import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConstructorFragment, Contract, ethers, formatEther } from 'ethers'
import { ProductService } from "./products/product.service";
import { ProductStatus } from "./types/product-status";
import { TransactionService } from "./transactions/transaction.service";
import { networkInterfaces } from "os";
import { ConfigService } from "@nestjs/config";

// smart contract
const contractAddress = "0x7C7836D69E13527F349eE06D08F6AFC45aF788D7";
// Abi can't define enum State in solidity, so we should change enum into uint8
const abi = [
    "function create_new_product(string memory _name, uint _cost) public payable returns (uint)",
    "function get_manner(address _addr) public view returns (uint)",
    "function get_product_state(uint _productId) public view returns (uint8)",
    "function cancel_product(uint _productId) public",
    "function proceed_product_state(uint _productId) public payable",
    "event NewProduct(uint productId, string name, uint cost, address owner)",
    "event ProductCanceled(uint productId, address by)",
    "event ProductStateChanged(uint productId, uint8 newState)"
]


@Injectable()
export class TransactionListenerService implements OnModuleInit {

    constructor(
        private readonly productService: ProductService,
        private readonly transactionService: TransactionService,
        private readonly configService: ConfigService
    ) { }

    private provider: ethers.JsonRpcProvider;
    private contract: ethers.Contract;


    async onModuleInit() {

        const apiKey = this.configService.get<string>('sepolia.apiKey') ?? "";
        const privateKey = this.configService.get<string>('sepolia.privateKey') ?? "";
        const ALCHEMY_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;

        this.provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);

        const signer = new ethers.Wallet(privateKey, this.provider);

        this.contract = new Contract(contractAddress, abi, signer);

        this.contract.on("NewProduct", (txid, pname, cost, owner) => {
            const productId = parseInt(pname);
            this.productService.updateProductStatusByTx(productId, ProductStatus.PENDING);
            this.transactionService.createNewTransaction(txid, productId, cost, owner);
        })

        this.contract.on("ProductCanceled", (txId, _) => {
            this.transactionService.cancelTransactinByTxId(txId);
        })

        this.contract.on("ProductStateChanged", (txId, pStatus) => {
            this.transactionService.changeTransactionStatus(txId, pStatus);
        })
    }
}