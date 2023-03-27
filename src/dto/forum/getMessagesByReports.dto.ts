import {IsNumber} from "class-validator";


export class getMessagesByReportsDto {

  @IsNumber()
  languageId: number

  @IsNumber()
  page: number;

}