import {IsNumber} from "class-validator";

export class setDefaultLanguageDto {

  @IsNumber()
  languageId: number;

}