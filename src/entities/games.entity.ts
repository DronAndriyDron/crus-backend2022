import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PlayerStatus} from "./playerStatus.entity";
import {Rates} from "./rates.entity";
import {Ratings} from "./ratings.entity";
import {Seasons} from "./seasons.entity";
import {GameLineups} from "./gameLineups.entity";


@Entity()

export class Games {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fixture: number;

  @Column()
  home: string;

  @Column()
  homeId: number;

  @Column()
  awayId: number;

  @Column()
  away: string;

  @Column()
  status: string

  @Column()
  league: string

  @Column()
  round: string

  @Column()
  date: string;

  @Column()
  timezone: string

  @Column()
  city: string

  @Column()
  stadium: string

  @Column({nullable: true})
  homeAvatar: string;

  @Column({nullable: true})
  awayAvatar: string;

  @Column({nullable: true})
  homeScore: number;

  @Column({nullable: true})
  awayScore: number;

  @Column({nullable: true})
  formation: string;

  @Column({nullable: true})
  homeShotsOnGoal: number;

  @Column({nullable: true})
  homeShotsTotal: number;

  @Column({nullable: true})
  homeBlockShots: number;

  @Column({nullable: true})
  homeShotsInsideBox: number;

  @Column({nullable: true})
  homeShotsOutsideBox: number;

  @Column({nullable: true})
  homeFouls: number;

  @Column({nullable: true})
  homeCorners: number;

  @Column({nullable: true})
  homeOffsides: number;

  @Column({nullable: true})
  homeBallPossession: number;

  @Column({nullable: true})
  homeSaves: number;

  @Column({nullable: true})
  homePassesTotal: number;

  @Column({nullable: true})
  homePassesAccurate: number;

  @Column({nullable: true})
  homeYellowCard: number;

  @Column({nullable: true})
  homeRedCard: number;


  @Column({nullable: true})
  awayShotsOnGoal: number;

  @Column({nullable: true})
  awayShotsTotal: number;

  @Column({nullable: true})
  awayBlockShots: number;

  @Column({nullable: true})
  awayShotsInsideBox: number;

  @Column({nullable: true})
  awayShotsOutsideBox: number;

  @Column({nullable: true})
  awayFouls: number;

  @Column({nullable: true})
  awayCorners: number;

  @Column({nullable: true})
  awayOffsides: number;

  @Column({nullable: true})
  awayBallPossession: number;

  @Column({nullable: true})
  awaySaves: number;

  @Column({nullable: true})
  awayPassesTotal: number;

  @Column({nullable: true})
  awayPassesAccurate: number;

  @Column({nullable: true})
  awayYellowCard: number;

  @Column({nullable: true})
  awayRedCard: number;

  @ManyToOne(() => Seasons, season => season.games)
  @JoinColumn()
  season: Seasons;

  @OneToMany(() => Rates, rate => rate.game)
  @JoinColumn()
  rate: Rates[];

  @OneToMany(() => PlayerStatus, stat => stat.game)
  @JoinColumn()
  statuses: PlayerStatus[];

  @OneToMany(() => Ratings, rating => rating.game)
  @JoinColumn()
  rating: Ratings[];

  @OneToMany(() => GameLineups, (gameLineups) => gameLineups.game)
  @JoinColumn()
  gameLineups: GameLineups[]

}