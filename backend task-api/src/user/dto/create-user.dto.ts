import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: "L'adresse email est obligatoire" })
    @IsEmail({}, { message: "L'adresse email n'est pas valide" })
    email!: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
    @IsString()
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    password!: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Le rôle spécifié est invalide' })
  role?: Role;
}