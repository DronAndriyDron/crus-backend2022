import {IsNotEmpty} from "class-validator";


export class getPlayersAndStatusesDto {

  @IsNotEmpty()
  gameId: number

  @IsNotEmpty()
  userId: number

}