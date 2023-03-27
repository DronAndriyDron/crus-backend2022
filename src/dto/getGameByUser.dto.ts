import {IsNumber} from "class-validator";


export class getGameByUserDto{
  @IsNumber()
  gameId: number;

  @IsNumber()
  userId: number;

  playersFormId?: number
}