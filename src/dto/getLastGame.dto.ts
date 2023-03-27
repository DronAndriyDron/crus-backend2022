import {IsNotEmpty, IsNumberString} from "class-validator";



export class getLastGameDto {

  @IsNotEmpty()
  @IsNumberString()
  season: string
}