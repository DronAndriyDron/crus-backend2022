import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Players } from "./players.entity";
import {Rates} from "./rates.entity";

@Entity()
export class RatesLineups  {

  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  role: string;

  @ManyToOne(() => Rates, (rates) => rates.ratesLineups)
  @JoinColumn()
  rates: Rates

  @ManyToOne(() => Players, (player) => player.ratesLineups)
  @JoinColumn()
  player: Players

}