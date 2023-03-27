import {IsNumber, IsString} from "class-validator";

export class editForumLanguageDto {
  @IsNumber()
  languageId: number;

  @IsString()
  name: string;
}