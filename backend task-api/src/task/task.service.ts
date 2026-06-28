import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { Role } from '../user/role.enum'; 

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) { }

  // 1. Créer une tâche liée à l'utilisateur connecté
  async create(createTaskDto: any, userId: number): Promise<TaskEntity> {
    const { categoryId, title, description, ...rest } = createTaskDto;
    const normalizedTitle = (title || '').trim();

    // Détection de doublon uniquement parmi les tâches du même utilisateur
    const existing = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoin('task.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('LOWER(task.title) = LOWER(:title)', { title: normalizedTitle })
      .getOne();

    if (existing) {
      throw new ConflictException('Cette tâche existe déjà.');
    }

    return this.taskRepository.save({
      ...rest,
      title: normalizedTitle,
      description: description || '',
      user: { id: userId }, 
      category: categoryId ? { id: categoryId } : undefined,
    });
  }

  // 2. Lecture globale : Les ADMINS voient tout, les USERS voient uniquement leurs propres tâches
  async findAll(currentUser: { id: number; role: Role }): Promise<TaskEntity[]> {
    const filter = currentUser.role === Role.ADMIN ? {} : { user: { id: currentUser.id } };

    return this.taskRepository.find({
      where: filter,
      relations: { category: true },
      order: { createdAt: 'DESC' }
    });
  }

  // 3. Récupérer une seule tâche (404 si elle n'appartient pas à l'USER et qu'il n'est pas ADMIN)
  async findOne(id: number, currentUser: { id: number; role: Role }): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { user: true, category: true }
    });
    
    // Si la tâche n'existe pas, ou si elle appartient à quelqu'un d'autre alors que l'appelant n'est pas ADMIN
    if (!task || (currentUser.role !== Role.ADMIN && task.user.id !== currentUser.id)) {
      throw new NotFoundException(`La tâche spécifiée est introuvable`); // Masquage par une 404
    }

    return task;
  }

  // 4. Mettre à jour une tâche de façon sécurisée (ADMIN ou Propriétaire)
  async update(id: number, updateTaskDto: any, currentUser: { id: number; role: Role }): Promise<TaskEntity> {
    // La méthode findOne lève une 404 automatique si l'accès n'est pas autorisé
    await this.findOne(id, currentUser);

    const { categoryId, ...rest } = updateTaskDto;
    const updateData: any = { ...rest };
    if (categoryId !== undefined) {
      updateData.category = categoryId ? { id: categoryId } : null;
    }

    await this.taskRepository.update(id, updateData);
    return this.findOne(id, currentUser);
  }

  // 5. Supprimer une tâche de façon sécurisée (ADMIN ou Propriétaire)
  async remove(id: number, currentUser: { id: number; role: Role }): Promise<{ message: string }> {
    // La méthode findOne lève une 404 automatique si l'accès n'est pas autorisé
    const task = await this.findOne(id, currentUser);
    
    await this.taskRepository.remove(task);
    return { message: `La tâche avec l'ID ${id} a été supprimée avec succès` };
  }
}