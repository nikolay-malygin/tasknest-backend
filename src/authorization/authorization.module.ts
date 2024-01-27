import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { User, UserSchema } from '../schemas/user.schema';
import { EmailService } from '../email/email.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	controllers: [AuthorizationController],
	providers: [AuthorizationService, EmailService],
})
export class AuthorizationModule {}
