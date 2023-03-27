import {IsNotEmpty} from "class-validator";


export class addEmotionDto {

  @IsNotEmpty()
  emotion: string

  @IsNotEmpty()
  messageId: number

  @IsNotEmpty()
  userId: number

}