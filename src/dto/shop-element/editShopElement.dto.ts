import {IsNotEmpty} from "class-validator";


export class editShopElementDto {

  @IsNotEmpty()
  elementId: number

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  type: 'playerForm' | 'goalkeeperForm' | 'stadium'

  @IsNotEmpty()
  isInShop: string;

  price?: number;
  level?: number;

}