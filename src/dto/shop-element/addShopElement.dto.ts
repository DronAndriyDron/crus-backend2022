import {IsNotEmpty} from "class-validator";


export class addShopElementDto {

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  type: 'playerForm' | 'goalkeeperForm' | 'stadium'

  @IsNotEmpty()
  isInShop: string;

  price?: number;
  level?: number;

}