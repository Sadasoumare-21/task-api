import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CategoryEntity } from '../category/category.entity'; // Correction du chemin ici

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 'PENDING' })
  status!: string;

  @ManyToOne(() => UserEntity, (user) => user.tasks, { onDelete: 'CASCADE' })
  user!: UserEntity;

  // Relation Many-to-One vers la catégorie déplacée
  @ManyToOne(() => CategoryEntity, (category) => category.tasks, { onDelete: 'SET NULL', nullable: true })
  category!: CategoryEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}