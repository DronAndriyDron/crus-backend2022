import {IsNumber, IsString} from "class-validator";

export class editNewsLanguageDto {
  @IsNumber()
  languageId: number;

  @IsString()
  name: string;
}