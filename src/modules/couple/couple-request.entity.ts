import { Column } from "typeorm";

import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";
import { CoupleRequestStatus } from "./enums/couple-request-status.enum";
import { CommonEntity } from "src/audit/base.entity";

@Entity()
export class CoupleRequest extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User,{lazy: true})
  sender: User;

  @ManyToOne(() => User,{lazy: true}) 
  receiver: User;

  @Column({
    type: 'enum',
    enum: CoupleRequestStatus,  
    default: CoupleRequestStatus.PENDING
  })
  status: CoupleRequestStatus;

  @Column({
    type: 'date',
  })
  firstMetDate: Date;
} 