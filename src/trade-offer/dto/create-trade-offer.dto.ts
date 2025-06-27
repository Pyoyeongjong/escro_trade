import { Type } from "class-transformer";
import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateTradeOfferDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(999999999)
    cost: number;
}