import { Observable } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../models/friend-request.entity';
import { FriendRequest, FriendRequestStatus, FriendRequest_Status } from '../models/friend-request.interface';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.class';
export declare class UserService {
    private readonly userRepository;
    private readonly friendRequestRepository;
    constructor(userRepository: Repository<UserEntity>, friendRequestRepository: Repository<FriendRequestEntity>);
    findUserById(id: number): Observable<User>;
    updateUserImageById(id: number, imagePath: string): Observable<UpdateResult>;
    findImageNameByUserId(id: number): Observable<string>;
    hasRequestBeenSentOrReceived(creator: User, receiver: User): Observable<boolean>;
    sendFriendRequest(receiverId: number, creator: User): Observable<FriendRequest | {
        error: string;
    }>;
    getFriendRequestStatus(receiverId: number, currentUser: User): Observable<FriendRequestStatus>;
    getFriendRequestUserById(friendRequestId: number): Observable<FriendRequest>;
    respondToFriendRequest(statusRespose: FriendRequest_Status, friendRequestId: number): Observable<FriendRequestStatus>;
    getFriendRequestsFromRecipients(currentUser: User): Observable<FriendRequest[]>;
    getFriends(currentUser: User): Observable<User[]>;
}
