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

        // 📊 últimos 7 dias
        function getLast7Days() {
            const days = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                d.setHours(0, 0, 0, 0);
                days.push(d);
            }

            return days;
        }

        const days = getLast7Days();

        const revenueByDay = days.map((day) => {
            const next = new Date(day);
            next.setDate(day.getDate() + 1);

            const total = appointments
                .filter(
                    (a) => new Date(a.date) >= day && new Date(a.date) < next
                )
                .reduce((sum, a) => sum + (a.service?.price || 0), 0);

            return {
                date: day.toISOString().slice(0, 10),
                total,
            };
        });

        // 🥇 serviços mais usados
        const serviceCount: any = {};

        appointments.forEach((a) => {
            const name = a.service?.name || "Sem nome";

            serviceCount[name] = (serviceCount[name] || 0) + 1;
        });

        const topServices = Object.entries(serviceCount).map(
            ([name, total]) => ({
                name,
                total,
            })
        );

        return {
            todayRevenue,
            monthRevenue,
            totalClients: clients,
            totalAppointments: appointments.length,
            todayAppointments,
            revenueByDay,
            topServices,
        };
    }
}