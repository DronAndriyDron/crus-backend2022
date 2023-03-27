import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { ForumMessage } from "./forumMessage.entity";
import {NewsContent} from "./newsContent.entity";
import {ForumThemeLanguage} from "./forumThemeLanguage";
import {NewsLanguage} from "./newsLanguage.entity";


@Entity()
export class ForumTheme{

    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    title: string 

    @Column()
    date: string;

    @Column({default:false})
    isConfirmed: boolean;

    @OneToMany(() => ForumMessage, messages =>messages.message)
    @JoinColumn()
    messages: ForumMessage[];

    @ManyToOne(() => ForumThemeLanguage, forumThemeLanguage => forumThemeLanguage.forumTheme)
    @JoinColumn()
    language: ForumThemeLanguage;
}