import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

/* Index is used to speed up the search in database */ 
@Index(['name', 'type'])
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    type: string

    @Index()
    @Column()
    name: string

    @Column('json')
    payload: Record<string, any>
}
