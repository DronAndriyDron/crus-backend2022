import {IsArray, IsNumber} from "class-validator";
import { PlayerStatusType } from "src/types/playerStatusType.type";


export class editPlayersStatus{

    @IsNumber()
    gameId:number;

    @IsArray()
    statuses:PlayerStatusType[];
}