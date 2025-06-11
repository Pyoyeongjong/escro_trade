import { Controller, Get, Post } from "@nestjs/common";

@Controller('transaction')
export class TransactionController {
    
    // TODO:
    @Get('userTx/:id') 
    getUserTx(){

    }

    @Get('allTx') 
    getAllTx(){

    }

    @Get('productTx/:id')
    getProductTx(){

    }

    @Post('saveTx')
    saveTx(){
        
    }
}