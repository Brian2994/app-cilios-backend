import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentService {
    constructor(private prisma: PrismaService) { }

    async create(data: any, userId: string) {
        const start = new Date(data.date);
        const duration = data.duration ?? 60;
        const end = new Date(start.getTime() + duration * 60000);

        const appointments = await this.prisma.appointment.findMany({
            where: { userId },
        });

        const conflict = appointments.find((a) => {
            const aStart = new Date(a.date);
            const aDuration = a.duration ?? 60;
            const aEnd = new Date(aStart.getTime() + aDuration * 60000);

            return aStart < end && aEnd > start;
        });

        if (conflict) {
            throw new Error('Já existe um agendamento nesse horário');
        }

        return this.prisma.appointment.create({
            data: {
                date: start,
                duration,
                service: data.service,
                price: data.price,
                clientId: data.clientId,
                userId,
                status: data.status ?? 'scheduled',
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.appointment.findMany({
            where: { userId },
            include: {
                client: true,
            },
            orderBy: { date: 'asc' },
        });
    }

    findOne(id: string, userId: string) {
        return this.prisma.appointment.findFirst({
            where: { id, userId },
            include: {
                client: true,
            },
        });
    }

    async update(id: string, data: any, userId: string) {
        // opcional: validar conflito também no update (versão futura)
        return this.prisma.appointment.updateMany({
            where: { id, userId },
            data,
        });
    }

    remove(id: string, userId: string) {
        return this.prisma.appointment.deleteMany({
            where: { id, userId },
        });
    }
}