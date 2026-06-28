import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Le titre de la tâche',
    example: 'Tâche 1',
  })
  @IsNotEmpty({ message: 'Le titre ne doit pas être vide' })
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'L\'id de la catégorie doit être un nombre' })
  categoryId?: number;
}