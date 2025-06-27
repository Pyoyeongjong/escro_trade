import { Body, Get, HttpStatus, Param, ParseFilePipe, ParseFilePipeBuilder, ParseIntPipe, Query, Req, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, ValidationPipe } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ProductImgValidationPipe } from "./product-image-validation.pipe";
import { CreateProductDto } from "./dto/create-product.dto";
import { diskStorage } from "multer";
import { extname } from "path";
import { ParseImagesPipe } from "./parse-img.pipe";
import { ProductService } from "./product.service";
import { throws } from "assert";
import { AuthGuard } from "@nestjs/passport";
import { getAccessToken } from "src/commom/utils/auth.utils";
import { ReplyDto } from "src/replies/dto/reply.dto";
import { access } from "fs";
import { CreateTradeOfferDto } from "src/trade-offer/dto/create-trade-offer.dto";
import { MyAuthGuard } from "src/auth/auth.guard";
import { Request } from "express";
import { UpdateProductStatusDto } from "./dto/update-product-status.dto";

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) { }

    @UseInterceptors(FilesInterceptor('image', 5, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
                const ext = extname(file.originalname);
                cb(null, `${unique}${ext}`);
            }
        })
    }))
    @Post('create')
    @UseGuards(MyAuthGuard)
    async createProduct(
        @Req() req: Request,
        @Body(ValidationPipe) createProductDto: CreateProductDto,
        @UploadedFiles(new ParseImagesPipe(5 * 1024 * 1024))
        files: Express.Multer.File[],
    ) {
        console.log(req.user);
        const username = req.user!.username;
        const imageUrls = files?.map(file => `http://localhost:3001/uploads/${file.filename}`) || [];
        return this.productService.saveProduct(createProductDto, username, imageUrls);
    }

    @UseInterceptors(FilesInterceptor('image', 5, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
                const ext = extname(file.originalname);
                cb(null, `${unique}${ext}`);
            }
        })
    }))
    @Post('update/:id')
    @UseGuards(MyAuthGuard)
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
        @Body(ValidationPipe) createProductDto: CreateProductDto,
        @UploadedFiles(new ParseImagesPipe(5 * 1024 * 1024))
        files: Express.Multer.File[],
    ) {
        const username = req.user!.username;
        const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];
        return await this.productService.updateProduct(id, createProductDto, username, imageUrls);
    }

    @Post(':productId/addReply')
    @UseGuards(MyAuthGuard)
    async createReply(
        @Param('productId', ParseIntPipe) productId: number,
        @Req() req: Request,
        @Body(ValidationPipe) replyDto: ReplyDto
    ) {
        const username = req.user!.username;
        return await this.productService.addReply(replyDto, productId, username);
    }

    @Post('remove/:productId')
    @UseGuards(MyAuthGuard)
    async removeProduct(
        @Param('productId', ParseIntPipe) productId: number,
        @Req() req: Request,
    ) {
        const username = req.user!.username;
        return await this.productService.removeProduct(username, productId);
    }

    @Get('getProductsTo/:id')
    @UseGuards(MyAuthGuard)
    getTradeOffer(
        @Req() req: Request,
        @Param('id', ParseIntPipe) productId: number
    ) {
        const username = req.user!.username;
        return this.productService.getProductsTo(username, productId);
    }

    @Post(':productId/offerTrade')
    @UseGuards(MyAuthGuard)
    async offerTrade(
        @Param('productId', ParseIntPipe) productId: number,
        @Req() req: Request,
        @Body(ValidationPipe) createTradeOfferDto: CreateTradeOfferDto
    ) {

        const username = req.user!.username;
        return await this.productService.createTradeOffer(createTradeOfferDto, username, productId);
    }

    @Get('getProduct/:productId')
    async getOneProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        return await this.productService.getProduct(productId);
    }

    @Post('setStatus/:productId')
    @UseGuards(MyAuthGuard)
    async setStatus(
        @Req() req: Request,
        @Param("productId", ParseIntPipe) productId: number,
        @Body(ValidationPipe) updateProductStatusDto: UpdateProductStatusDto
    ) {
        const username = req.user!.username;
        return await this.productService.updateProductStatus(username, productId, updateProductStatusDto);
    }

    //TODO:
    @Post(':productId/report')
    @UseGuards(MyAuthGuard)
    async reportProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ) {

    }

    // 페이징 처리 해야한다!
    @Get('getProducts')
    async getProducts(
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.productService.getPaginatedProducts(page, limit);
    }
}