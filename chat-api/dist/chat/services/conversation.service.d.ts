import { Observable } from 'rxjs';
import { User } from 'src/auth/models/user.class';
import { DeleteResult, Repository } from 'typeorm';
import { ActiveConversationEntity } from '../models/active-conversation.entity';
import { ActiveConversation } from '../models/active-conversation.interface';
import { ConversationEntity } from '../models/conversation.entity';
import { Conversation } from '../models/conversation.interface';
import { MessageEntity } from '../models/message.entity';
import { Message } from '../models/message.interface';
export declare class ConversationService {
    private readonly conversationRepository;
    private readonly activeConversationRepository;
    private readonly messageRepository;
    constructor(conversationRepository: Repository<ConversationEntity>, activeConversationRepository: Repository<ActiveConversationEntity>, messageRepository: Repository<MessageEntity>);
    getConversation(creatorId: number, friendId: number): Observable<Conversation | undefined>;
    createConversation(creator: User, friend: User): Observable<Conversation>;
    getConversationsForUser(userId: number): Observable<Conversation[]>;
    getUsersInConversation(conversationId: number): Observable<Conversation[]>;
    getConversationsWithUsers(userId: number): Observable<Conversation[]>;
    joinConversation(friendId: number, userId: number, socketId: string): Observable<ActiveConversation>;
    leaveConversation(socketId: string): Observable<DeleteResult>;
    getActiveUsers(conversationId: number): Observable<ActiveConversation[]>;
    createMessage(message: Message): Observable<Message>;
    getMessages(conversationId: number): Observable<Message[]>;
    removeActiveConversations(): Observable<DeleteResult>;
    removeMessages(): Observable<DeleteResult>;
    removeConversations(): Observable<DeleteResult>;
}
