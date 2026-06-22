import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Le nom de la catégorie ne doit pas être vide' })
    @IsString({ message: 'Le nom doit être une chaîne de caractères' })
    @Length(3, 20, { message: 'Le nom doit contenir entre 3 et 20 caractères' })
    name!: string;
}