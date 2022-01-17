import { FeedPostEntity } from '../../feed/models/post.entity';
import { FriendRequestEntity } from './friend-request.entity';
import { Role } from './role.enum';
import { ConversationEntity } from 'src/chat/models/conversation.entity';
import { MessageEntity } from 'src/chat/models/message.entity';
export declare class UserEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imagePath: string;
    role: Role;
    feedPosts: FeedPostEntity[];
    sentFriendRequests: FriendRequestEntity[];
    receivedFriendRequests: FriendRequestEntity[];
    conversations: ConversationEntity[];
    messages: MessageEntity[];
}
