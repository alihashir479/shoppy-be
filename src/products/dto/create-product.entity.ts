import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    price: number
}