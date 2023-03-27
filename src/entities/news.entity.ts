import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { NewsEmotions } from "./newsEmotion.entity";
import {NewsContent} from "./newsContent.entity";

@Entity()

export class News {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    image: string
    
    @Column()
    date: Date;

    @OneToMany(() => NewsEmotions, emotions => emotions.news)
    @JoinColumn()
    emotions: NewsEmotions[];

    @OneToMany(() => NewsContent, content => content.news)
    @JoinColumn()
    content: NewsContent[];


}