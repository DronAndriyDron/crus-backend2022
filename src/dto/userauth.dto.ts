import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import { emitWarning } from "process";
import {UserRole} from "../types/userroles.type";

export class LoginUserDto{

    @IsNotEmpty()

    email:string;

    @IsNotEmpty()

    password: string;
}

export class RegisterUserDto{

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    login:string;
    
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    surname:string;
    
    @IsNotEmpty()
    password: string;

    role?:UserRole
}