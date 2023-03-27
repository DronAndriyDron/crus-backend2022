import {Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ShopElementToUser} from "./shopElementToUser.entity";


@Entity()
export class ShopElement {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  type: string;

  @Column()
  isInShop: boolean;

  @Column({default: 0})
  price: number;

  @Column({default: 0})
  level: number;

  @Column({default: false})
  isDefault: boolean;

  @OneToMany(() => ShopElementToUser, shopElementToUser => shopElementToUser.shopElement)
  @JoinTable()
  shopElementToUser: ShopElementToUser[];
}