import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { User } from 'src/auth/models/user.class';
import { AuthService } from 'src/auth/services/auth.service';
import { Message } from '../models/message.interface';
import { ConversationService } from '../services/conversation.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private authService;
    private conversationService;
    constructor(authService: AuthService, conversationService: ConversationService);
    onModuleInit(): void;
    server: Server;
    handleConnection(socket: Socket): void;
    getConversations(socket: Socket, userId: number): Subscription;
    handleDisconnect(socket: Socket): void;
    createConversation(socket: Socket, friend: User): void;
    handleMessage(socket: Socket, newMessage: Message): import("rxjs").Observable<null>;
    joinConversation(socket: Socket, friendId: number): void;
    leaveConversation(socket: Socket): void;
}
