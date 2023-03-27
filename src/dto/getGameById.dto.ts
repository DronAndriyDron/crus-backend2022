import {IsNumber} from "class-validator";


export class getGameByIdDto{
  @IsNumber()
  gameId: number;
  playersFormId?: number;
  userId: number;
}