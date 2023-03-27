import {IsNumber, IsString} from "class-validator";


export class changePasswordDto{
  @IsString()
  actualPassword: string;

  @IsString()
  newPassword: string

  @IsNumber()
  userId: number
}

