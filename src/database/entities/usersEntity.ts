import { Entity, Column, Index } from 'typeorm';

import BaseEntity from './baseEntity';

@Entity('users')
export default class User extends BaseEntity {

  @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
    username: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    password: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;
}
