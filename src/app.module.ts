import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorizationModule } from './authorization/authorization.module';
import { CategoriesModule } from './categories/categories.module';
import { EmailModule } from './email/email.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING),
		AuthorizationModule,
		CategoriesModule,
		EmailModule,
		UsersModule,
		TasksModule,
	],
	providers: [ChatGateway],
})
export class AppModule {}
