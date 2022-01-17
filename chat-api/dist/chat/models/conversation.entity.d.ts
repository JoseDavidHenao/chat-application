import { UserEntity } from "src/auth/models/user.entity";
import { MessageEntity } from "./message.entity";
export declare class ConversationEntity {
    id: number;
    users: UserEntity[];
    messages: MessageEntity[];
    lastUpdated: Date;
}
