// src/chat/chat.gateway.ts
import { Logger } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	type OnGatewayInit,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*', // Update to your frontend URL
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	},
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');
	private users = new Map<string, string>(); // Maps socket ID to user ID

	afterInit(server: Server) {
		this.logger.log('Initialized');
	}

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
		// Optionally, handle user authentication and add user to the map
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		this.users.delete(client.id); // Remove user from map
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, room: string) {
		client.join(room);
		this.logger.log(`Client ${client.id} joined room ${room}`);
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(client: Socket, room: string) {
		client.leave(room);
		this.logger.log(`Client ${client.id} left room ${room}`);
	}

	@SubscribeMessage('sendMessage')
	handleMessage(client: Socket, { room, message }: { room: string; message: string }) {
		this.server.to(room).emit('message', { userId: this.users.get(client.id), message });
	}
}
