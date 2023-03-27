import { Entity, PrimaryGeneratedColumn ,Column} from "typeorm";

@Entity()
export class UserRating {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userId: number;

    @Column()
    position: number;

    @Column()
    points: number;

}