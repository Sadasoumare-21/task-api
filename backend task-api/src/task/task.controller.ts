import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Ajuste le chemin selon ton projet
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto'; // Pense à importer ton UpdateTaskDto s'il existe
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Task')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // 1. Création d'une tâche liée à l'utilisateur connecté
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: any): Promise<TaskEntity> { 
    // On extrait l'id pour la création
    const userId = req.user.id;
    return this.taskService.create(createTaskDto, userId);
  }

  // 2. Récupération globale (Filtrée par le service selon le rôle ADMIN ou USER)
  @Get()
  async findAll(@Req() req: any): Promise<TaskEntity[]> {
    // On transmet req.user complet pour gérer la distinction de rôle
    return this.taskService.findAll(req.user);
  }

  // 3. Récupération d'une seule tâche (404 si non autorisé)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<TaskEntity> {
    return this.taskService.findOne(id, req.user);
  }

  // 4. Modification d'une tâche (ADMIN ou Propriétaire)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto, // Tu peux utiliser UpdateTaskDto ici
    @Req() req: any,
  ): Promise<TaskEntity> {
    return this.taskService.update(id, updateTaskDto, req.user);
  }

  // 5. Suppression d'une tâche (ADMIN ou Propriétaire)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<{ message: string }> {
    return this.taskService.remove(id, req.user);
  }
}