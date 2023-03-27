import {IsNotEmpty} from "class-validator";


export class getUsersRatingDto{

    @IsNotEmpty()
     userId:number;


}