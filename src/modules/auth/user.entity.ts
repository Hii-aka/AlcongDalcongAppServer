import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "../../audit/base.entity";
import { CoupleStatus } from "../couple/enums/couple-status.enum";


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

    @Column()
    gender: string; 

    @Column({
        type: 'enum',
        enum: CoupleStatus,
        default: CoupleStatus.NOT_COUPLED
    })
    coupleStatus: CoupleStatus;
    
    @Column({ nullable: true })
    hashedRefreshToken?: string;

}