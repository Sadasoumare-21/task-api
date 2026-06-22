import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) { }

  async create(createTaskDto: any, userId: number): Promise<TaskEntity> {
    const { categoryId, title, description, ...rest } = createTaskDto;

    return this.taskRepository.save({
      ...rest,
      title: title || '',
      description: description || '',
      user: { id: userId }, // Lie la tâche à l'utilisateur connecté
      category: categoryId ? { id: categoryId } : undefined,
    });
  }

  // 🟢 Remplace la méthode par celle-ci dans ton service
  async findAllByUserId(userId: number): Promise<any> {
    return this.taskRepository.find({
      where: {
        user: { id: userId }
      },
      relations: {
        category: true,
      },
      order: {
        createdAt: 'DESC',
      }
    });
  }

  // 🟢 Correction du findAll par défaut pour qu'il renvoie aussi un tableau TaskEntity[]
  async findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      relations: { category: true }
    });
  }

  // Récupérer une seule tâche par son ID de façon sécurisée (avec validation de propriété)
  async findOne(id: number, userId: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { user: true, category: true }
    });
    if (!task) {
      throw new NotFoundException(`Tâche # ${id} introuvable`);
    }
    
    // Contrôle d'accès : Seul le propriétaire de la tâche peut y accéder
    if (task.user.id !== userId) {
      throw new ForbiddenException(`Vous n'avez pas l'autorisation d'accéder à cette tâche.`);
    }

    return task;
  }

  // Mettre à jour une tâche de façon sécurisée
  async update(id: number, updateTaskDto: any, userId: number): Promise<TaskEntity> {
    // Vérifie d'abord que la tâche existe et appartient à l'utilisateur
    await this.findOne(id, userId);

    const { categoryId, ...rest } = updateTaskDto;
    const updateData: any = { ...rest };
    if (categoryId !== undefined) {
      updateData.category = categoryId ? { id: categoryId } : null;
    }

    await this.taskRepository.update(id, updateData);
    return this.findOne(id, userId);
  }

  // Supprimer une tâche de façon sécurisée
  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }
}