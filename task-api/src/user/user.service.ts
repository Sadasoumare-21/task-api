import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 1. Créer un utilisateur (Inscription)
  async create(createUserDto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const { email, password } = createUserDto;
    
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`L'adresse email ${email} est déjà utilisée`);
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    const savedUser = await this.userRepository.save(newUser);
    
    // CORRECTION TS2790 : Extraction sécurisée du mot de passe
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // 2. Récupérer tous les utilisateurs
  async findAll(): Promise<Omit<UserEntity, 'password'>[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    // On retire le mot de passe de chaque utilisateur de la liste
    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // 3. Récupérer un utilisateur par son ID
  async findOne(id: number): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 4. Méthode spéciale pour l'authentification (récupère le mot de passe pour bcrypt.compare)
  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // 5. Modifier un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<UserEntity, 'password'>> {
    // On utilise findOneBy ici pour éviter l'erreur de type sur l'objet complet
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }

    // Si le mot de passe est modifié, on le hache
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // CORRECTION TS2790 : Extraction sécurisée du mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
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