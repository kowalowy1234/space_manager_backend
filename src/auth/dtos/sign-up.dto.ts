import { IsString, IsNotEmpty, IsEmail, IsStrongPassword, IsPhoneNumber, IsOptional } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password!: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string | null | undefined;
}