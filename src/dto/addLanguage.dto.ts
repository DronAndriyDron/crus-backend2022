import { IsString } from "class-validator";


export class addLanguageDto {

  @IsString()
  name: string;

}