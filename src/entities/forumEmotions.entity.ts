import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { ForumMessage } from "./forumMessage.entity";
import { ForumTheme } from "./forumTheme.entity";
import { Users } from "./user.entity";


@Entity()
export class ForumEmotions{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    emotion:string;

    @ManyToOne(() => Users, user => user.forumEmotions)
    @JoinColumn()
    user: Users;

    @ManyToOne(() => ForumMessage, message => message.forumEmotions)
    @JoinColumn()
    forumMessage: ForumMessage;

}