import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";


@Entity()
export class UserToken{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(() => Users)
    @JoinColumn()
    users: Users;

    @Column()
    refreshtoken:string;

}