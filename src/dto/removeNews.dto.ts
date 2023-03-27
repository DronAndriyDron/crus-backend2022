import {IsNumber} from "class-validator";

export class removeNewsDto
{
  @IsNumber()
  newsId: number
}