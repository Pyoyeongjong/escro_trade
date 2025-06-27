import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateLocationDto {
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    location: string
}