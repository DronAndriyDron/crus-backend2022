import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { ForumTheme } from "./forumTheme.entity";


@Entity()
export class ForumThemeLanguage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isDefault: boolean;

  @OneToMany(() => ForumTheme, forumTheme => forumTheme.language)
  forumTheme: ForumTheme[];
}