import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;

        if (!authHeader) return false;

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, 'supersecret');
            request.user = decoded;
            return true;
        } catch {
            return false;
        }
    }
}