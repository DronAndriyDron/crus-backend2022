import {IsNotEmpty} from "class-validator";


export class addTrophyDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  coach: string;

  @IsNotEmpty()
  date: string;

}