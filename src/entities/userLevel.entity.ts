import { Entity, PrimaryGeneratedColumn ,Column} from "typeorm";

@Entity()
export class UserLevel {

  @PrimaryGeneratedColumn()
  id :number;

  @Column()
  name: string;

  @Column()
  priority: number;

  @Column()
  points: number;

}