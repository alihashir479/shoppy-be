import { IsEmail, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsStrongPassword({ minLength: 8, minSymbols: 1, minUppercase: 0, minNumbers: 0, minLowercase: 1})
    password: string
}