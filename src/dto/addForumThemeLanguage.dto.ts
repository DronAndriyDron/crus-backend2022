import { IsString } from "class-validator";



export class addForumThemeLanguageDto {

  @IsString()
  name: string;

}