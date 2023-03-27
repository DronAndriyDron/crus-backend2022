import {IsNotEmpty, IsNumber} from "class-validator";



export class getNewsDto {

  @IsNotEmpty()
  @IsNumber()
  page:number;

  userLanguage?: string
}