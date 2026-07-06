import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'mikey@gmail.com', description: 'L\'adresse email' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Le mot de passe (min 6 caractères)' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Le rôle spécifié est invalide' })
  role?: Role;
}