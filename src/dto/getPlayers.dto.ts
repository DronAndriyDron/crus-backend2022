import {IsNumber} from "class-validator";

export class getPlayersDto {

  @IsNumber()
  page: number;

  @IsNumber()
  userId: number;
}