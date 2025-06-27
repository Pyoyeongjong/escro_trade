import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateWalletDto {
    @IsString()
    wallet: string
}