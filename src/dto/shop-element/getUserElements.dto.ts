import {IsNotEmpty} from "class-validator";


export class getUserElementsDto {

  @IsNotEmpty()
  userId: number

  @IsNotEmpty()
  type: string

}