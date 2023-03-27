import {IsNumber} from "class-validator";


export class removeMessageDto
{
  @IsNumber()
  messageId: number
}