import {IsNumber, IsString} from "class-validator";


export class addThemeMessageDto{

  @IsNumber()
  themeId:number;

  @IsString()
  message: string;

  @IsNumber()
  userId: number

}