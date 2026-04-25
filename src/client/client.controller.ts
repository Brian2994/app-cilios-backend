import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Patch,
    Delete,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('clients')
export class ClientController {
    constructor(private clientService: ClientService) { }

    @Post()
    create(@Body() body: any, @Req() req: any) {
        return this.clientService.create(body, req.user.sub);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.clientService.findAll(req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.clientService.findOne(id, req.user.sub);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
        return this.clientService.update(id, body, req.user.sub);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.clientService.remove(id, req.user.sub);
    }
}