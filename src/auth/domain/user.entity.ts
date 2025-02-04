import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "src/audit/base.entity";

@Entity()
export class User extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    loginType: 'email' | 'kakao' | 'apple';

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    nickname?: string;

    @Column({ nullable: true })
    profileImage?: string;

    @Column({ nullable: true })
    hashedRefreshToken?: string;

}