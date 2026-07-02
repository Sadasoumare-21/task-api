import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 🟢 Health check endpoint — utilisé par Render pour vérifier que l'app est vivante
  @Get()
  healthCheck(): object {
    return {
      status: 'OK',
      message: '🚀 TaskFlow API est opérationnelle !',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
