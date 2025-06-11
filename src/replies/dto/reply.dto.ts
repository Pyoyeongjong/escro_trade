import { IsString, MaxLength, MinLength } from "class-validator";

export class ReplyDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    description: string
}