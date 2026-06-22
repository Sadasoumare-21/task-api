import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module'; // Import du nouveau module

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    UserModule,
    CategoryModule, // Ajout du module ici
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}