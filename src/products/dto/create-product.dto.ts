import { Type } from "class-transformer";
import { IsNumber, isNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    title: string;

    @IsString()
    @MinLength(20)
    @MaxLength(300)
    description: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(999999999)
    cost: number;
}