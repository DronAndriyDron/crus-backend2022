import {IsNotEmpty} from "class-validator";


export class buyElementDto {

  @IsNotEmpty()
  elementId: number

  @IsNotEmpty()
  userId: number
}