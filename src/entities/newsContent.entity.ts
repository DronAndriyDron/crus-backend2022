import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { News } from "./news.entity";
import { Users } from "./user.entity";
import {UserToken} from "./usertoken.entity";
import {NewsLanguage} from "./newsLanguage.entity";


@Entity()
export class NewsContent {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => News, news => news.content)
  @JoinColumn()
  news: News;

  @ManyToOne(() => NewsLanguage, newsLanguage => newsLanguage.content)
  @JoinColumn()
  language: NewsLanguage;

}