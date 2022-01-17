import { UserEntity } from 'src/auth/models/user.entity';
import { ConversationEntity } from './conversation.entity';
export declare class MessageEntity {
    id: number;
    message: string;
    user: UserEntity;
    conversation: ConversationEntity;
    createdAt: Date;
}
