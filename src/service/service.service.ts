import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) { }

    async create(data: any, userId: string) {
        if (!data.name) {
            throw new BadRequestException('Nome obrigatório');
        }

        if (!data.price || data.price <= 0) {
            throw new BadRequestException('Preço inválido');
        }

        return this.prisma.service.create({
            data: {
                name: data.name,
                price: Number(data.price),
                duration: data.duration ? Number(data.duration) : 60,
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.service.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    }

    async update(id: string, data: any, userId: string) {
        const service = await this.prisma.service.findFirst({
            where: { id, userId },
        });

        if (!service) {
            throw new NotFoundException('Serviço não encontrado');
        }

        if (data.price && Number(data.price) <= 0) {
            throw new BadRequestException('Preço inválido');
        }

        return this.prisma.service.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.price && { price: Number(data.price) }),
                ...(data.duration && { duration: Number(data.duration) }),
            },
        });
    }

    async remove(id: string, userId: string) {
        const service = await this.prisma.service.findFirst({
            where: { id, userId },
        });

        if (!service) {
            throw new NotFoundException('Serviço não encontrado');
        }

        return this.prisma.service.delete({
            where: { id },
        });
    }
}