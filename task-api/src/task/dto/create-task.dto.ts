import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Le titre ne doit pas être vide' })
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'L\'id de la catégorie doit être un nombre' })
  categoryId?: number;

  @IsNotEmpty({ message: 'L\'id de l\'utilisateur est obligatoire' })
  @IsNumber({}, { message: 'L\'id de l\'utilisateur doit être un nombre' })
  userId!: number;
}