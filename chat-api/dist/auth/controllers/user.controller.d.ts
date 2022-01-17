/// <reference types="multer" />
import { Observable } from 'rxjs';
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';
import { FriendRequest, FriendRequestStatus } from '../models/friend-request.interface';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    uploadImage(file: Express.Multer.File, req: any): Observable<{
        modifiedFileName: string;
    } | {
        error: string;
    }>;
    findImage(req: any, res: any): Observable<Object>;
    findImageImageName(req: any): Observable<{
        imageName: string;
    }>;
    findUserById(userStringId: string): Observable<User>;
    sendFriendRequest(receiverStringId: string, req: any): Observable<FriendRequest | {
        error: string;
    }>;
    getFriendRequestStatus(receiverStringId: string, req: any): Observable<FriendRequestStatus>;
    respondToFriendRequest(friendRequestStringId: string, statusResponse: FriendRequestStatus): Observable<FriendRequestStatus>;
    getFriendRequestsFromRecipients(req: any): Observable<FriendRequestStatus[]>;
    getFriends(req: any): Observable<User[]>;
}
