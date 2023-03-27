import {IsNotEmpty} from "class-validator";


export class openUserBoxDto {
  @IsNotEmpty()
  userId: number
}