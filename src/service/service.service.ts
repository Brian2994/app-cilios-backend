import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) { }

    create(data: any, userId: string) {
        return this.prisma.service.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.service.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    update(id: string, data: any, userId: string) {
        return this.prisma.service.updateMany({
            where: { id, userId },
            data,
        });
    }

    remove(id: string, userId: string) {
        return this.prisma.service.deleteMany({
            where: { id, userId },
        });
    }
}