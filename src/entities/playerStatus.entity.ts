
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Games } from "./games.entity";
import { Players } from "./players.entity";
import {Users} from "./user.entity";




@Entity()
export class PlayerStatus{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @ManyToOne(() => Games, game => game.statuses)
    @JoinColumn()
    game: Games;

    @ManyToOne(() => Players, player => player.statuses)
    @JoinColumn()
    player: Players;

}