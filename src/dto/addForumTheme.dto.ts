import {IsNumber, IsString} from "class-validator";


export class addForumThemeDto{

  @IsString()
  title:string;

  @IsNumber()
  forumLanguageId: number;

}