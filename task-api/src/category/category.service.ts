import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  // 1. Créer une catégorie
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const { name } = createCategoryDto;

    // Vérifier si la catégorie existe déjà
    const existingCategory = await this.categoryRepository.findOneBy({ name });
    if (existingCategory) {
      throw new ConflictException(`La catégorie "${name}" existe déjà`);
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  // 2. Récupérer toutes les catégories
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  // 3. Récupérer une catégorie par son ID (avec ses tâches associées)
  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      // CORRECTION : On utilise un objet au lieu d'un tableau ['tasks']
      relations: {
        tasks: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`La catégorie avec l'ID ${id} n'existe pas`);
    }
    return category;
  }

  // 4. Supprimer une catégorie
  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id); // Vérifie si elle existe
    await this.categoryRepository.remove(category);
    return { message: `La catégorie "${category.name}" a été supprimée avec succès` };
  }
}