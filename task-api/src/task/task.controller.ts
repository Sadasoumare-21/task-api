import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks') // Organise les routes sous la section "Tasks" dans Swagger
@ApiBearerAuth('JWT-auth') // Ajoute le cadenas de sécurité sur Swagger
@Controller('tasks')
@UseGuards(JwtAuthGuard) // <--- Protège TOUTES les routes des tâches d'un coup !
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    // req.user contient le profil extrait du JWT (id, email, role) envoyé par le JwtAuthGuard
    const userId = req.user.id; 
    
    // On passe l'id de l'utilisateur connecté au service pour l'associer à la tâche
    return this.taskService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Req() req: any) {
    // On récupère le user complet (avec son rôle) pour filtrer l'affichage
    const user = req.user;
    return this.taskService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.taskService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any
  ) {
    return this.taskService.update(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.taskService.remove(id, req.user);
  }
}