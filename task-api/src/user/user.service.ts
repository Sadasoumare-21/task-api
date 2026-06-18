import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 1. Créer un utilisateur (Inscription)
  async create(createUserDto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const { email } = createUserDto;
    
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`L'adresse email ${email} est déjà utilisée`);
    }

    const newUser = this.userRepository.create(createUserDto);
    
    // NOTE : Le hachage du mot de passe avec bcrypt sera fait ici lors de l'étape Auth
    
    const savedUser = await this.userRepository.save(newUser);
    delete savedUser.password; // Sécurité : ne pas renvoyer le mot de passe
    return savedUser;
  }

  // 2. Récupérer tous les utilisateurs
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }, // Sélection sous forme d'objet TypeORM
    });
  }

  // 3. Récupérer un utilisateur par son ID
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }, // Sélection sous forme d'objet TypeORM
    });
    
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }
    return user;
  }

  // 4. Méthode interne pour l'authentification (besoin du mot de passe pour comparer)
  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // 5. Modifier un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }

    // Fusionner les modifications
    const updatedUser = Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(updatedUser);
    
    delete savedUser.password;
    return savedUser;
  }

  // 6. Supprimer un utilisateur
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }
    
    await this.userRepository.remove(user);
    return { message: `L'utilisateur avec l'ID ${id} a été supprimé avec succès` };
  }
}