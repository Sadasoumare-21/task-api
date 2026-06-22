import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TaskEntity } from '../task/task.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ unique: true })
    name!: string;

  @OneToMany(() => TaskEntity, (task) => task.category)
    tasks!: TaskEntity[];

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}