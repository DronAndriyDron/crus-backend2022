import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Games } from "./games.entity";
import { Players } from "./players.entity";



@Entity()
export class Ratings{
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "numeric"})
    rating: number;

    @Column()
    shotsOnGoal: number;

    @Column()
    shotsTotal: number;

    @Column()
    passesTotal: number;

    @Column()
    passesKey: number;

    @Column()
    goals: number;

    @Column()
    assists: number;

    @Column()
    dribblesTotal: number;

    @Column()
    dribblesSuccess: number;

    @Column()
    redCards: number;

    @Column()
    yellowCards: number;

    @Column()
    minutes: number;

    @Column()
    passesAccuracy: number;

    @Column()
    foulCommitted: number;

    @Column()
    foulDrawn: number;

    @Column()
    offsides: number;


    @ManyToOne(() => Games, game => game.rating)
    @JoinColumn()
    game: Games;  
    
    @ManyToOne(() => Players, player => player.rating)
    @JoinColumn()
    player: Players;

}