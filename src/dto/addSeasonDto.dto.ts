import { IsString } from "class-validator";




export default class AddSeasonDto{

    @IsString()
    name:string;
}