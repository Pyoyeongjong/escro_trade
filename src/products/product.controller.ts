import { Body, Get, HttpStatus, Param, ParseFilePipe, ParseFilePipeBuilder, ParseIntPipe, Req, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, ValidationPipe } from "@nestjs/common";
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

@Controller('product')
export class ProductController {

    constructor (private productService: ProductService){}

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
    @UseGuards(AuthGuard())
    async createProduct(
        @Req() req: Request,
        @Body(ValidationPipe) createProductDto: CreateProductDto,
        @UploadedFiles(new ParseImagesPipe(5 * 1024 * 1024))
        files: Express.Multer.File[],
    ){
        const accessToken = getAccessToken(req);
        if (!accessToken) {
            throw new UnauthorizedException('Unauthorized User');
        }

        const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];
        return this.productService.saveProduct(createProductDto, accessToken, imageUrls);
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
    @UseGuards(AuthGuard())
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
        @Body(ValidationPipe) createProductDto: CreateProductDto,
        @UploadedFiles(new ParseImagesPipe(5 * 1024 * 1024))
        files: Express.Multer.File[],
    ){
        const accessToken = getAccessToken(req);
        if (!accessToken) {
            throw new UnauthorizedException('Unauthorized User');
        }

        const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];
        return await this.productService.updateProduct(id ,createProductDto, accessToken, imageUrls);
    }

    @Post(':productId/addReply')
    @UseGuards(AuthGuard())
    async createReply(
        @Param('productId', ParseIntPipe) productId: number,
        @Req() req: Request,
        @Body(ValidationPipe) replyDto: ReplyDto
    ){
        const accessToken = getAccessToken(req);
        if(!accessToken) {
            throw new UnauthorizedException('Unauthorized User');
        }

        return await this.productService.addReply(replyDto, productId, accessToken);
    }

    //TODO:
    @Post('remove/:productId')
    async removeProduct(){

    }

    @Post(':productId/report') 
    @UseGuards(AuthGuard())
    async reportProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ) {

    }

    @Post(':productId/offerTrade')
    @UseGuards(AuthGuard())
    async offerTrade(
        @Param('productId', ParseIntPipe) productId: number,
    ){

    }

    // 페이징 처리 해야한다!
    @Get('getProducts')
    async getProducts(

    ){

    }

    // 페이징 처리 해야한다!
    @Get('getReplies')
    async getReplies(

    ){

    }

    @Get('getProduct/:productId')
    async getOneProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ){

    }
}