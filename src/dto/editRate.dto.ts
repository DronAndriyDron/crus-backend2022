import {IsArray, IsNumber, IsString} from "class-validator";

interface IRatesCaptains {
  playerId: number,
  position: "defender" | "midfielder" | "attacker"
}



export class editRateDto {

  @IsNumber()
  rateId: number

  @IsNumber()
  gameId: number

  @IsNumber()
  shots: number;

  @IsNumber()
  successShots: number;

  @IsNumber()
  passes: number;

  @IsNumber()
  successPasses: number;

  @IsNumber()
  dribbles: number;

  @IsNumber()
  successDribbles: number;

  @IsNumber()
  ballAccuracy: number;

  @IsArray()
  lineups: Record<string, any>[]

  @IsArray()
  captains: Record<string, any>[]

  @IsString()
  formation: string;

}