import {IsNotEmpty} from "class-validator";


export class setShopElementDefaultDto {

  @IsNotEmpty()
  elementId: number;


  @IsNotEmpty()
  userId: number

}