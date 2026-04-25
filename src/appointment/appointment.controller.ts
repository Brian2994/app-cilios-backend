import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('appointments')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) { }

    @Post()
    create(@Body() body: any, @Req() req: any) {
        return this.appointmentService.create(body, req.user.sub);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.appointmentService.findAll(req.user.sub);
    }
}