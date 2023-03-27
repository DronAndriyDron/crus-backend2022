import {IsNumber, IsNumberString} from "class-validator";


export class GetGameByUserResult{

    @IsNumber()
    userId: number;

    @IsNumber()
    page: number;

    @IsNumberString()
    season: string


}