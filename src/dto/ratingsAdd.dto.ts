import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

import { PlayerRating } from "src/types/playerRating.type";


export class RatingAddDto{

    @IsNumber()
    gameId:number;
    @IsNumber()
    homeScore: number;
    @IsNumber()
    awayScore: number;
    
    @IsNotEmpty()
    @IsArray()
    players:PlayerRating[];

   /*  @IsNotEmpty()
    @IsArray()
    goals:PlayerGoals[]; */

}