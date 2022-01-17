import { FriendRequest_Status } from './friend-request.interface';
import { UserEntity } from './user.entity';
export declare class FriendRequestEntity {
    id: number;
    creator: UserEntity;
    receiver: UserEntity;
    status: FriendRequest_Status;
}
