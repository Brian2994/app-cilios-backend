import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(userId: string) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        // 🔥 busca dados
        const [appointments, clients] = await Promise.all([
            this.prisma.appointment.findMany({
                where: { userId },
                include: { service: true, client: true },
            }),
            this.prisma.client.count({
                where: { userId },
            }),
        ]);

        // 💰 faturamento hoje
        const todayRevenue = appointments
            .filter(a => new Date(a.date) >= todayStart && new Date(a.date) <= todayEnd)
            .reduce((sum, a) => sum + (a.service?.price || 0), 0);

        // 💰 faturamento mês
        const monthRevenue = appointments
            .filter(a => new Date(a.date) >= monthStart)
            .reduce((sum, a) => sum + (a.service?.price || 0), 0);

        // 📅 hoje
        const todayAppointments = appointments.filter(
            a => new Date(a.date) >= todayStart && new Date(a.date) <= todayEnd
        );

        return {
            todayRevenue,
            monthRevenue,
            totalClients: clients,
            totalAppointments: appointments.length,
            todayAppointments,
        };
    }
}