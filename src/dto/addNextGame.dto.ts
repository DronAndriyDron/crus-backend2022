import {IsNotEmpty, IsNumber, IsString} from "class-validator"


export class addNextGameDto
{
  @IsNotEmpty()
  @IsString()
  season: string;

  @IsNotEmpty()
  @IsNumber()
  fixture: number

  @IsNotEmpty()
  @IsString()
  away: string;

  @IsNotEmpty()
  @IsString()
  home: string;

  @IsNotEmpty()
  @IsString()
  awayAvatar: string;

  @IsNotEmpty()
  @IsString()
  homeAvatar: string;

  @IsNotEmpty()
  @IsNumber()
  awayId: number

  @IsNotEmpty()
  @IsNumber()
  homeId: number

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  league: string;

  @IsNotEmpty()
  @IsString()
  round: string;

  @IsNotEmpty()
  @IsString()
  stadium: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  timezone: string;
}