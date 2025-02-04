import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null;
}