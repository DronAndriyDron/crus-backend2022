import {IsNumberString, IsString} from "class-validator";

export class addPlayerDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  position: "defender" | "midfielder" | "attacker";

  @IsNumberString()
  number: number;
}