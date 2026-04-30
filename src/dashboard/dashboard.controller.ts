import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private dashboard: DashboardService) { }

    @Get()
    getStats(@Req() req: any) {
        return this.dashboard.getStats(req.user.sub);
    }
}