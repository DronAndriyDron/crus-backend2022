import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { PlayerStatus } from "./playerStatus.entity";
import { Ratings } from "./ratings.entity";
import {RatesLineups} from "./ratesLineups.entity";
import {RatesCaptains} from "./ratesCaptains.entity";
import {GameLineups} from "./gameLineups.entity";


@Entity()
export class Players{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 1001620001})
    idAPI: number;

    @Column({default: ''})
    nameAPI: string;

    @Column({type:'varchar',  default: ""})
    name: string;

    @Column({type:'varchar', default: ""})
    surname: string;

    @Column({type:'varchar'})
    position: string;

    @Column()
    number: number;

    @Column({type:'boolean',default:true})
    isInClub: boolean

    @Column({type:'varchar',  default: ""})
    image: string;


    @OneToMany(() => RatesLineups, (ratesLineups) => ratesLineups.player)
    @JoinColumn()
    ratesLineups: RatesLineups[];

    @OneToMany(() => GameLineups, (gameLineups) => gameLineups.player)
    @JoinColumn()
    gamesLineups: GameLineups[];

    @OneToMany(() => RatesCaptains, (ratesCaptains) => ratesCaptains.player)
    @JoinColumn()
    ratesCaptains: RatesCaptains[];

    @OneToMany(() => Ratings, rating =>rating.player)
    @JoinColumn()
    rating: Ratings[];

    @OneToMany(()=> PlayerStatus,stat=>stat.player)
    @JoinColumn()
    statuses: PlayerStatus[];

}