import {IsNumberString} from "class-validator";


export class getMessagesByTheme {

  @IsNumberString()
  themeId: number

  @IsNumberString()
  page: number;

}