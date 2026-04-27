import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    Delete,
    Param,
    Patch,
} from '@nestjs/common';
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

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.appointmentService.findOne(id, req.user.sub);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: any,
        @Req() req: any,
    ) {
        return this.appointmentService.update(id, body, req.user.sub);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.appointmentService.remove(id, req.user.sub);
    }
}