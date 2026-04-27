import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('services')
export class ServiceController {
    constructor(private serviceService: ServiceService) { }

    @Post()
    create(@Body() body: any, @Req() req: any) {
        return this.serviceService.create(body, req.user.sub);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.serviceService.findAll(req.user.sub);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
        return this.serviceService.update(id, body, req.user.sub);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.serviceService.remove(id, req.user.sub);
    }
}