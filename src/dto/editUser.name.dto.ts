import {IsNumber, IsString} from "class-validator";


export class editUserNameDto{
  @IsString()
  name: string;

  @IsString()
  surname: string

  @IsNumber()
  userId: number;

  @IsString()
  login: string;
}