import {IsNotEmpty, IsNumber} from "class-validator";


export class getOneNewsDto {

  @IsNotEmpty()
  @IsNumber()
  newsId:number;

  userLanguage?: string
}