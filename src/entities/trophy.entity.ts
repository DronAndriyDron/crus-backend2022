import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { ForumMessage } from "./forumMessage.entity";
import {NewsContent} from "./newsContent.entity";
import {ForumThemeLanguage} from "./forumThemeLanguage";
import {NewsLanguage} from "./newsLanguage.entity";


@Entity()
export class Trophy {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string 

    @Column()
    date: Date;

    @Column()
    image: string;

    @Column()
    coach: string;
}