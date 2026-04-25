import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) { }

    create(data: any, userId: string) {
        return this.prisma.client.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.client.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: string, userId: string) {
        return this.prisma.client.findFirst({
            where: { id, userId },
        });
    }

    update(id: string, data: any, userId: string) {
        return this.prisma.client.update({
            where: { id },
            data,
        });
    }

    remove(id: string, userId: string) {
        return this.prisma.client.delete({
            where: { id },
        });
    }
}