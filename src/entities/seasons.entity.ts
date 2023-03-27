import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Games } from "./games.entity";


@Entity()
export class Seasons{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar'})
    name:string;

    @OneToMany(() => Games, games => games.season)
    games: Games[];

}