import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('hello')
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  @Get()
  hello() {
    return {
      message: 'Hello from NestJS API ',
    };
  }
}
