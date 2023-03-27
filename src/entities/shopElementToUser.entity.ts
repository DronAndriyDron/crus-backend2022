import {Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./user.entity";
import {ShopElement} from "./shopElement.entity";


@Entity()
export class ShopElementToUser {

  @PrimaryGeneratedColumn()
  id:number;

  @ManyToOne(() => Users, user => user.shopElementToUser)
  @JoinTable()
  user: Users;

  @ManyToOne(() => ShopElement, shopElement => shopElement.shopElementToUser)
  @JoinTable()
  shopElement: ShopElement;

}