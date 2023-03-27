import {IsString} from "class-validator";

export class addFormDto {
  @IsString()
  name: string;
}