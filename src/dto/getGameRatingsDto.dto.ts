import { IsNumberString } from "class-validator";


export class GetGameRatingDto{

    
    @IsNumberString()
    gameId:number;


}