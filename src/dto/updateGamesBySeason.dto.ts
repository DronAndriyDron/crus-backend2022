import {IsNumberString, IsString} from "class-validator";


export class updateGamesBySeasonDto{

  @IsNumberString()
  season: string;
}