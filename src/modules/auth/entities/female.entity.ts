import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "../../../audit/base.entity";


@Entity()
export class Female extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    loginType: 'email' | 'kakao' | 'apple';

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ unique: true })
    nickname?: string;

    @Column({ nullable: true })
    profileImage?: string;

    @Column({ nullable: true })
    hashedRefreshToken?: string;

}