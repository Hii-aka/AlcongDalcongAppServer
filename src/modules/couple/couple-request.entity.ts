import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";
import { CoupleRequestStatus } from "./enums/couple-request-status.enum";

@Entity()
export class CoupleRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User) 
  receiver: User;

  @Column({
    type: 'enum',
    enum: CoupleRequestStatus,  
    default: CoupleRequestStatus.PENDING
  })
  status: CoupleRequestStatus;

  @Column({
    type: 'date',
    nullable: true,
  })
  firstMetDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn() 
  updatedAt: Date;
} 