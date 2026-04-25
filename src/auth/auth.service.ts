import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: { email, password: hash },
        });

        return {
            id: user.id,
            email: user.email,
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            access_token: this.jwtService.sign({
                sub: user.id,
                email: user.email,
            }),
        };
    }
}