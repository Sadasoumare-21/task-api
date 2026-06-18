import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
    message: 'Le statut doit être PENDING, IN_PROGRESS ou COMPLETED',
  })
  status?: string;
}