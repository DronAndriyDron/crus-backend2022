import {IsNotEmpty} from "class-validator";


export class getShopElementsDto {

  @IsNotEmpty()
  page: number

  @IsNotEmpty()
  type: string

  @IsNotEmpty()
  isInShop: boolean
}