import {IsNotEmpty, IsNumber, IsString} from "class-validator"
import {IRatings} from "../intefaces/ratings";
import {ILineupsPlayer} from "../intefaces/lineups-player.interface";

export class addGamesStatsDto {

  @IsNumber()
  gameId: string

  @IsString()
  formation: string;

  @IsNumber()
  homeScore: number;

  @IsNumber()
  homeShotsOnGoal: number;

  @IsNumber()
  homeShotsTotal: number;

  @IsNumber()
  homeBlockShots: number;

  @IsNumber()
  homeShotsInsideBox: number;

  @IsNumber()
  homeShotsOutsideBox: number;

  @IsNumber()
  homeFouls: number;

  @IsNumber()
  homeCorners: number;

  @IsNumber()
  homeOffsides: number;

  @IsNumber()
  homeBallPossession: number;

  @IsNumber()
  homeSaves: number;

  @IsNumber()
  homePassesTotal: number;

  @IsNumber()
  homePassesAccurate: number;

  @IsNumber()
  homeYellowCard: number;

  @IsNumber()
  homeRedCard: number;

  @IsNumber()
  awayScore: number;

  @IsNumber()
  awayShotsOnGoal: number;

  @IsNumber()
  awayShotsTotal: number;

  @IsNumber()
  awayBlockShots: number;

  @IsNumber()
  awayShotsInsideBox: number;

  @IsNumber()
  awayShotsOutsideBox: number;

  @IsNumber()
  awayFouls: number;

  @IsNumber()
  awayCorners: number;

  @IsNumber()
  awayOffsides: number;

  @IsNumber()
  awayBallPossession: number;

  @IsNumber()
  awaySaves: number;

  @IsNumber()
  awayPassesTotal: number;

  @IsNumber()
  awayPassesAccurate: number;

  @IsNumber()
  awayYellowCard: number;

  @IsNumber()
  awayRedCard: number;

  @IsNotEmpty()
  ratings: IRatings[]

  @IsNotEmpty()
  lineups: ILineupsPlayer[];
}