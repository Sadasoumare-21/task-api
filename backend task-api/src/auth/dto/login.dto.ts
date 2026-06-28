import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'mikey@gmail.com', description: 'L\'adresse email de l\'utilisateur' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'L\'email ne doit pas être vide' })
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Le mot de passe' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vide' })
  password!: string;
}