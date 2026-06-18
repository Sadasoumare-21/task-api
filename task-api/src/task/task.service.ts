import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  // 1. Créer une tâche
  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { categoryId, userId, ...taskData } = createTaskDto;

    // Correction : On utilise undefined au lieu de null si categoryId n'est pas fourni
    const newTask = this.taskRepository.create({
      ...taskData,
      user: { id: userId }, 
      category: categoryId ? { id: categoryId } : undefined, 
    });

    return await this.taskRepository.save(newTask);
  }

  // 2. Récupérer toutes les tâches
  async findAll(): Promise<TaskEntity[]> {
    return await this.taskRepository.find({
      // Correction : Passage au format objet pour les relations
      relations: {
        user: true,
        category: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  // 3. Récupérer une tâche par son ID
  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      // Correction : Passage au format objet pour les relations
      relations: {
        user: true,
        category: true,
      },
    });
    
    if (!task) {
      throw new NotFoundException(`La tâche avec l'ID ${id} n'existe pas`);
    }
    return task;
  }

  // 4. Modifier une tâche
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.findOne(id); 
    
    const { categoryId, ...taskData } = updateTaskDto;

    Object.assign(task, taskData);

    if (categoryId !== undefined) {
      // Correction : Assignation propre pour éviter les conflits de types
      task.category = categoryId ? { id: categoryId } as any : undefined;
    }

    return await this.taskRepository.save(task);
  }

  // 5. Supprimer une tâche
  async remove(id: number): Promise<{ message: string }> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    return { message: `La tâche avec l'ID ${id} a été supprimée avec succès` };
  }
}