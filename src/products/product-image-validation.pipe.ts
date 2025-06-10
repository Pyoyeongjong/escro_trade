import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { Admin } from "typeorm";

@Injectable()
export class ProductImgValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        return value;
    }
}