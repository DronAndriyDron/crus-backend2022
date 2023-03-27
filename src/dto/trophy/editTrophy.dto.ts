import {IsNotEmpty} from "class-validator";


export class editTrophyDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  coach: number;

  @IsNotEmpty()
  date: string;

}