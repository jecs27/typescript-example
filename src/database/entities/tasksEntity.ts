import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Priority } from '@utils/enums';

import BaseEntity from './baseEntity';
import User from './usersEntity';

@Entity('tasks')
export default class Task extends BaseEntity {

  @PrimaryGeneratedColumn()
    id: number;

  @Index()
  @Column({ type: 'uuid', name: 'user_uuid' })
    userUuid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

  @Column({ type: 'text', nullable: true })
    description: string;

  @Column({ type: 'boolean', default: false })
    completed: boolean;

  @Column({ type: 'enum', enum: [...Object.values(Priority)] })
    priority: Priority;

  @Column({ type: 'timestamp', name: 'due_date', nullable: true })
    dueDate: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
    user: User;
}
