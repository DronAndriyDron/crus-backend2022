import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Players } from "./players.entity";
import {Rates} from "./rates.entity";

@Entity()
export class RatesCaptains  {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @ManyToOne(() => Rates, (rates) => rates.ratesCaptains)
  @JoinColumn()
  rates: Rates

  @ManyToOne(() => Players, (player) => player.ratesCaptains)
  @JoinColumn()
  player: Players
}


