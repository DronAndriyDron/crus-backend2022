import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { News } from "./news.entity";
import { Users } from "./user.entity";
import {NewsContent} from "./newsContent.entity";


@Entity()
export class NewsLanguage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isDefault: boolean;

  @OneToMany(() => NewsContent, newsContent => newsContent.language)
  content: NewsContent[];
}