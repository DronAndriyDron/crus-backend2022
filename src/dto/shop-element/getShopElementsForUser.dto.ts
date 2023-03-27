import {IsNotEmpty} from "class-validator";


export class getShopElementsForUserDto {

  @IsNotEmpty()
  page: number

  @IsNotEmpty()
  type: string

}