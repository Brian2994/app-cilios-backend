import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentService {
    constructor(private prisma: PrismaService) { }

    async create(data: any, userId: string) {
        if (!data.clientId) {
            throw new BadRequestException('Cliente obrigatório');
        }

        if (!data.serviceId) {
            throw new BadRequestException('Serviço obrigatório');
        }

        const start = new Date(data.date);
        const duration = data.duration ?? 60;
        const end = new Date(start.getTime() + duration * 60000);

        // 🔥 busca só possíveis conflitos (otimizado)
        const conflicts = await this.prisma.appointment.findMany({
            where: {
                userId,
                date: {
                    gte: new Date(start.getTime() - duration * 60000),
                    lte: end,
                },
            },
        });

        const hasConflict = conflicts.some((a) => {
            const aStart = new Date(a.date);
            const aEnd = new Date(
                aStart.getTime() + (a.duration ?? 60) * 60000
            );

            return aStart < end && aEnd > start;
        });

        if (hasConflict) {
            throw new BadRequestException(
                'Já existe um agendamento nesse horário'
            );
        }

        return this.prisma.appointment.create({
            data: {
                date: start,
                duration,
                serviceId: data.serviceId,
                clientId: data.clientId,
                userId,
                status: data.status ?? 'scheduled',
            },
            include: {
                service: true,
                client: true,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.appointment.findMany({
            where: { userId },
            include: {
                client: true,
                service: true,
            },
            orderBy: { date: 'asc' },
        });
    }

    findOne(id: string, userId: string) {
        return this.prisma.appointment.findFirst({
            where: { id, userId },
            include: {
                client: true,
                service: true,
            },
        });
    }

    async update(id: string, data: any, userId: string) {
        const appt = await this.prisma.appointment.findFirst({
            where: { id, userId },
        });

        if (!appt) {
            throw new NotFoundException('Agendamento não encontrado');
        }

        return this.prisma.appointment.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, userId: string) {
        const appt = await this.prisma.appointment.findFirst({
            where: { id, userId },
        });

        if (!appt) {
            throw new NotFoundException('Agendamento não encontrado');
        }

        return this.prisma.appointment.delete({
            where: { id },
        });
    }
}