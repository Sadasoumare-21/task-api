import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TaskEntity } from '../task/task.entity'; 
import { Role } from './role.enum'; 

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ unique: true })
    email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({
        type: 'varchar',
        default: Role.USER,
    })
    role!: Role;

  @OneToMany(() => TaskEntity, (task) => task.user)
    tasks!: TaskEntity[];

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}