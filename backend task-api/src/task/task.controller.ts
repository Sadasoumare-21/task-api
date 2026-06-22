import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Ajuste le chemin selon ton projet
import { TaskEntity } from './task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: any, @Req() req: any): Promise<TaskEntity> {
    const userId = req.user.id;
    return this.taskService.create(createTaskDto, userId);
  }

  // 🟢 LA CORRECTION : Ajoute les crochets [] pour indiquer que la route renvoie un TABLEAU de tâches
  // 🟢 Remplace la méthode par celle-ci dans ton contrôleur
@Get()
async findAll(@Req() req: any): Promise<any> {
  const userId = req.user.id;
  return this.taskService.findAllByUserId(userId);
}

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any): Promise<TaskEntity> {
    const userId = req.user.id;
    return this.taskService.findOne(+id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: any,
    @Req() req: any,
  ): Promise<TaskEntity> {
    const userId = req.user.id;
    return this.taskService.update(+id, updateTaskDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const userId = req.user.id;
    return this.taskService.remove(+id, userId);
  }
}  