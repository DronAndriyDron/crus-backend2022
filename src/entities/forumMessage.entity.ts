import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { ForumEmotions } from "./forumEmotions.entity";
import { ForumTheme } from "./forumTheme.entity";
import { Users } from "./user.entity";



@Entity()
export class ForumMessage {

    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    message: string 

    @Column()
    date: string;

    @Column({default: 0})
    reports: number;

    @ManyToOne(() => Users, user => user.messages)
    @JoinColumn()
    user: Users;

    @ManyToOne(() => ForumTheme, forumTheme => forumTheme.messages)
    @JoinColumn()
    forumTheme: ForumTheme;

    @OneToMany(() => ForumEmotions, forumEmotions => forumEmotions.forumMessage)
    @JoinColumn()
    forumEmotions: ForumEmotions[];

}