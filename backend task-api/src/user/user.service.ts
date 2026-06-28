import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './role.enum'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Utilisation interne par l'AuthService (Vérification d'existence à l'inscription)
  async findByEmail(email: string): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 1. Créer un utilisateur (Inscription)
  async create(createUserDto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const { email } = createUserDto;
    
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`L'adresse email ${email} est déjà utilisée`);
    }

    const newUser = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(newUser);
    
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // 2. Récupérer tous les utilisateurs (Réservé aux ADMINS)
  async findAll(currentUser: { id: number; role: Role }): Promise<Omit<UserEntity, 'password'>[]> {
    // Si l'utilisateur n'est pas ADMIN, on bloque directement l'accès
    if (currentUser.role !== Role.ADMIN) {
      throw new NotFoundException(); // On lève une 404 pour faire croire que la ressource globale n'existe pas pour lui
    }

    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // 3. Récupérer un utilisateur par son ID (ADMIN voit tout, USER voit uniquement son propre ID)
  async findOne(id: number, currentUser: { id: number; role: Role }): Promise<Omit<UserEntity, 'password'>> {
    // Si l'utilisateur n'est pas ADMIN et qu'il essaie de voir un autre ID que le sien
    if (currentUser.role !== Role.ADMIN && currentUser.id !== id) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 4. Méthode spéciale pour l'authentification (Interne)
  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // 5. Modifier un utilisateur (ADMIN modifie tout, USER modifie uniquement son propre compte)
  async update(id: number, updateUserDto: UpdateUserDto, currentUser: { id: number; role: Role }): Promise<Omit<UserEntity, 'password'>> {
    // On appelle notre méthode findOne pour appliquer la validation d'accès (ADMIN ou Soi-même)
    await this.findOne(id, currentUser);

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // 6. Supprimer un utilisateur (ADMIN supprime tout, USER supprime uniquement son propre compte)
  async remove(id: number, currentUser: { id: number; role: Role }): Promise<{ message: string }> {
    // On appelle notre méthode findOne pour appliquer la validation d'accès (ADMIN ou Soi-même)
    await this.findOne(id, currentUser);

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }
    
    await this.userRepository.remove(user);
    return { message: `L'utilisateur avec l'ID ${id} a été supprimé avec succès` };
  }
}