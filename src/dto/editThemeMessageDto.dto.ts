import {IsNumber, IsString} from "class-validator";


export class editThemeMessageDto{
  @IsNumber()
  messageId: number;

  @IsString()
  message: string
}