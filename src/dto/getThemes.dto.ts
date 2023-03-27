import {IsNotEmpty, IsNumber, IsNumberString} from "class-validator";


export class getThemesDto {

  @IsNumber()
  page: number;
  
  @IsNotEmpty()
  isConfirmed: boolean;

  @IsNotEmpty()
  forumLanguageId: number;
  
}