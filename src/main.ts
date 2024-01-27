import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');

	app.enableCors({
		origin: '*',
		allowedHeaders: ['Content-Type', 'Authorization'],
		exposedHeaders: ['Content-Type', 'Authorization'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		optionsSuccessStatus: 200,
		credentials: true,
	});

	await app.listen(process.env.PORT, () =>
		console.log(`[+] Server listening on port ${process.env.PORT}`)
	);
}

bootstrap();
