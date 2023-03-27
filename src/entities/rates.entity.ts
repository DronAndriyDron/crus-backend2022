import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Games } from "./games.entity";
import { Users } from "./user.entity";
import {RatesLineups} from "./ratesLineups.entity";
import {RatesCaptains} from "./ratesCaptains.entity";



@Entity()
export class Rates{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    shots: number;

    @Column()
    successShots: number;

    @Column()
    passes: number;

    @Column()
    successPasses: number;

    @Column()
    dribbles: number;

    @Column()
    successDribbles: number;

    @Column()
    ballAccuracy: number;

    @Column()
    formation: string;


    @ManyToOne(() => Games, game => game.rate)
    @JoinColumn()
    game: Games;
    
    @ManyToOne(() => Users, user => user.rates)
    @JoinColumn()
    user: Users;

    @OneToMany(() => RatesLineups, (ratesLineups) => ratesLineups.rates)
    @JoinColumn()
    ratesLineups: RatesLineups[]

    @OneToMany(() => RatesCaptains, (ratesCaptains) => ratesCaptains.rates)
    @JoinColumn()
    ratesCaptains: RatesCaptains[]


}