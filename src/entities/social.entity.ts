import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Social{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    link: string;

    @Column()
    isActive: boolean;

}