import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity as Task } from './task.entity'; // Utilise le vrai nom de ta classe
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // 1. Création : On associe automatiquement l'ID de l'utilisateur connecté
  async create(createTaskDto: CreateTaskDto, userId: number) {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      user: { id: userId }, // Relie la tâche à l'utilisateur connecté
    });
    return await this.taskRepository.save(newTask);
  }

  // 2. Lecture globale : L'ADMIN voit tout, l'USER ne voit que ses propres tâches
  async findAll(user: any) {
    if (user.role === 'ADMIN') {
      // Version avec la syntaxe objet moderne demandée par ton TypeORM
      return await this.taskRepository.find({ relations: { user: true } });
    }
    // Si c'est un simple USER, on filtre par son ID
    return await this.taskRepository.find({
      where: { user: { id: user.id } },
    });
  }

  // 3. Lecture unique : Sécurisée pour éviter qu'un USER espionne un autre
  async findOne(id: number, user: any) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { user: true }, // Syntaxe objet moderne { user: true }
    });

    if (!task) {
      throw new NotFoundException(`La tâche avec l'ID ${id} n'existe pas.`);
    }

    // Sécurité : Si ce n'est pas un ADMIN et que la tâche ne lui appartient pas -> Blocage
    if (user.role !== 'ADMIN' && task.user.id !== user.id) {
      throw new ForbiddenException(`Vous n'avez pas le droit de voir cette tâche.`);
    }

    return task;
  }

  // 4. Modification sécurisée
  async update(id: number, updateTaskDto: UpdateTaskDto, user: any) {
    const task = await this.findOne(id, user); // Vérifie d'abord l'existence et les droits d'accès

    // On applique les modifications
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  // 5. Suppression sécurisée
  async remove(id: number, user: any) {
    const task = await this.findOne(id, user); // Vérifie d'abord les droits d'accès
    await this.taskRepository.remove(task);
    return { message: `La tâche avec l'ID ${id} a été supprimée avec succès.` };
  }
}