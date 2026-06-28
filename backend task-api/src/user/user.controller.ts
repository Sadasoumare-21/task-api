import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. Création (Inscription ouverte ou ajout interne)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 2. Seuls les ADMINS peuvent lister tous les utilisateurs
  @Get()
  @Roles(Role.ADMIN) // <-- Verrouille la liste globale aux admins
  findAll(@Req() req: any) {
    return this.userService.findAll(req.user);
  }

  // 3. ADMIN voit tout, USER voit uniquement son propre ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.findOne(id, req.user);
  }

  // 4. ADMIN modifie tout, USER modifie son propre compte
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any
  ) {
    return this.userService.update(id, updateUserDto, req.user);
  }

  // 5. Suppression (Sécurisée en BDD dans le service + Guard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.remove(id, req.user);
  }
}