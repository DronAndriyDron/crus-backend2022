import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PlayersForm{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;
}