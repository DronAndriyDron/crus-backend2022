import {IsNotEmpty, IsNumber, IsNumberString} from "class-validator";



export class GetGamesDto {
    
    @IsNotEmpty()
    @IsNumber()
    page:number;

    @IsNotEmpty()
    @IsNumberString()
    season: string
}