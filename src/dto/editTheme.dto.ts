import { IsNotEmpty, IsNumber } from "class-validator"

export class editThemeDto {
     
    @IsNotEmpty()
     title:string

     @IsNotEmpty()
     @IsNumber()
     id: number;
 }