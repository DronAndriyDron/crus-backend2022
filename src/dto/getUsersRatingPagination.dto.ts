import { IsNotEmpty } from "class-validator";


export class getUsersRatingPagination{

  @IsNotEmpty()
  startPosition:number;

}