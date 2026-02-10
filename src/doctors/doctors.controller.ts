import { Controller, Put, Param } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('admin/doctors')
export class DoctorsController {
  constructor(private readonly service: DoctorsService) {}

  @Put(':id/approve')
  approveDoctor(@Param('id') id: number) {
    return this.service.approveDoctor(id);
  }
}
