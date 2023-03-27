import {IsNotEmpty, IsNumber} from "class-validator";


export class getPlayersInClubDto {
  @IsNotEmpty()
  userId: string

  @IsNumber()
  page: number;
}