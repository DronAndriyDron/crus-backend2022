import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToOne
} from "typeorm";
import {UserToken} from "./usertoken.entity";
import {UserRole} from "src/types/userroles.type";
import {Rates} from "./rates.entity";
import {ForumMessage} from "./forumMessage.entity";
import {ForumEmotions} from "./forumEmotions.entity";
import {ShopElementToUser} from "./shopElementToUser.entity";
import {ShopElement} from "./shopElement.entity";


@Entity()
export class Users {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  login: string;

  @Column({default: true})
  isAuthenticated: boolean;


  @Column({default: 1000})
  coins: number;

  @Column({default: 3})
  box: number;

  @Column({default: 0, type: "numeric"})
  experience: number;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({default: null})
  playerForm: number | null

  @Column({default: null})
  goalkeeperForm: number | null

  @Column({default: null})
  stadium: number | null


  @OneToOne(() => UserToken, usertoken => usertoken.users)
  usertoken: UserToken;

  @OneToMany(() => Rates, rates => rates.user)
  @JoinColumn()
  rates: Rates[];

  @OneToMany(() => ForumMessage, messages => messages.message)
  @JoinColumn()
  messages: ForumMessage[];

  @OneToMany(() => ForumEmotions, forumemotion => forumemotion.user)
  @JoinColumn()
  forumEmotions: ForumEmotions[];

  @OneToMany(() => ShopElementToUser, shopElementToUser => shopElementToUser.user)
  @JoinTable()
  shopElementToUser: ShopElementToUser[];

  @Column({default:null})
  userAvatar:string;
}