import { IsNotEmpty, IsNumber } from "class-validator";



export class editIsInClubDto{
     
    @IsNotEmpty()
    isInClub: boolean;

    @IsNotEmpty()
    @IsNumber()
    playerId: number;

}