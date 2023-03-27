import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()

export class LaLiga{

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    team: string

    @Column()
    logo: string
    
    @Column()
    rank: number
    
    @Column()
    points: number

    @Column()
    games: number

    @Column()
    win: number

    @Column()
    draw: number
    
    @Column()
    lose: number
    
    @Column()
    goalsScored: number
    
    @Column()
    goalsMissed: number

    @Column()
    form: string
}