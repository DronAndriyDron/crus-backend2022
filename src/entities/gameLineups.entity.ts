import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Players } from "./players.entity";
import {Games} from "./games.entity";

@Entity()
export class GameLineups  {

  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  role: string;

  @ManyToOne(() => Games, (game) => game.gameLineups)
  @JoinColumn()
  game: Games

  @ManyToOne(() => Players, (player) => player.gamesLineups)
  @JoinColumn()
  player: Players

}