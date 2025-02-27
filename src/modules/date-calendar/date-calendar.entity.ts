import { CommonEntity } from "src/audit/base.entity";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class DateCalendar extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'time' })
    time: string; // HH:mm

    @Column()
    location: string;

    @Column()
    coupleId: number;

}