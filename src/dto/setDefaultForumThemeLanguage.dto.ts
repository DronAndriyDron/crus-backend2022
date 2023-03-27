import {IsNumber} from "class-validator";

export class setDefaultForumThemeLanguageDto {

  @IsNumber()
  languageId: number;

}