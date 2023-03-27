import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { News } from "./news.entity";
import { Users } from "./user.entity";


@Entity()
export class NewsEmotions{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    emotion: string;

    @ManyToOne(() => Users, user => user.forumEmotions)
    @JoinColumn()
    user: Users;

    @ManyToOne(() => News, news => news.emotions)
    @JoinColumn()
    news: News;

}