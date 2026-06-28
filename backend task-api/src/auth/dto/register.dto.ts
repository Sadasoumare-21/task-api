import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'mikey@toman.com', description: 'L\'adresse email' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Le mot de passe (min 6 caractères)' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  @IsNotEmpty()
  password!: string;
}