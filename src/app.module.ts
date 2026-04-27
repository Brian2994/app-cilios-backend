import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { ServiceModule } from './service/service.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [PrismaModule, AuthModule, ClientModule, ServiceModule, AppointmentModule],
})
export class AppModule { }