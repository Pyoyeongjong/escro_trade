import { Body, HttpStatus, ParseFilePipe, ParseFilePipeBuilder, Req, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards } from "@nestjs/common";
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
    @Post('add-product')
    @UseGuards(AuthGuard())
    addProduct(
        @Req() req: Request,
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles(new ParseImagesPipe(5 * 1024 * 1024))
        files: Express.Multer.File[],
    ){
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException;
        }
        const accessToken = authHeader.split(' ')[1];
        const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];
        return this.productService.saveProduct(createProductDto, accessToken, imageUrls);
    }



}