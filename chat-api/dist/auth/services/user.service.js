"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const typeorm_2 = require("typeorm");
const friend_request_entity_1 = require("../models/friend-request.entity");
const user_entity_1 = require("../models/user.entity");
let UserService = class UserService {
    constructor(userRepository, friendRequestRepository) {
        this.userRepository = userRepository;
        this.friendRequestRepository = friendRequestRepository;
    }
    findUserById(id) {
        return (0, rxjs_1.from)(this.userRepository.findOne({ id }, { relations: ['feedPosts'] })).pipe((0, operators_1.map)((user) => {
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            delete user.password;
            return user;
        }));
    }
    updateUserImageById(id, imagePath) {
        const user = new user_entity_1.UserEntity();
        user.id = id;
        user.imagePath = imagePath;
        return (0, rxjs_1.from)(this.userRepository.update(id, user));
    }
    findImageNameByUserId(id) {
        return (0, rxjs_1.from)(this.userRepository.findOne({ id })).pipe((0, operators_1.map)((user) => {
            delete user.password;
            return user.imagePath;
        }));
    }
    hasRequestBeenSentOrReceived(creator, receiver) {
        return (0, rxjs_1.from)(this.friendRequestRepository.findOne({
            where: [
                { creator, receiver },
                { creator: receiver, receiver: creator },
            ],
        })).pipe((0, operators_1.switchMap)((friendRequest) => {
            if (!friendRequest)
                return (0, rxjs_1.of)(false);
            return (0, rxjs_1.of)(true);
        }));
    }
    sendFriendRequest(receiverId, creator) {
        if (receiverId === creator.id)
            return (0, rxjs_1.of)({ error: 'It is not possible to add yourself!' });
        return this.findUserById(receiverId).pipe((0, operators_1.switchMap)((receiver) => {
            return this.hasRequestBeenSentOrReceived(creator, receiver).pipe((0, operators_1.switchMap)((hasRequestBeenSentOrReceived) => {
                if (hasRequestBeenSentOrReceived)
                    return (0, rxjs_1.of)({
                        error: 'A friend request has already been sent of received to your account!',
                    });
                let friendRequest = {
                    creator,
                    receiver,
                    status: 'pending',
                };
                return (0, rxjs_1.from)(this.friendRequestRepository.save(friendRequest));
            }));
        }));
    }
    getFriendRequestStatus(receiverId, currentUser) {
        return this.findUserById(receiverId).pipe((0, operators_1.switchMap)((receiver) => {
            return (0, rxjs_1.from)(this.friendRequestRepository.findOne({
                where: [
                    { creator: currentUser, receiver: receiver },
                    { creator: receiver, receiver: currentUser },
                ],
                relations: ['creator', 'receiver'],
            }));
        }), (0, operators_1.switchMap)((friendRequest) => {
            if ((friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.receiver.id) === currentUser.id) {
                return (0, rxjs_1.of)({
                    status: 'waiting-for-current-user-response',
                });
            }
            return (0, rxjs_1.of)({ status: (friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.status) || 'not-sent' });
        }));
    }
    getFriendRequestUserById(friendRequestId) {
        return (0, rxjs_1.from)(this.friendRequestRepository.findOne({
            where: [{ id: friendRequestId }],
        }));
    }
    respondToFriendRequest(statusRespose, friendRequestId) {
        return this.getFriendRequestUserById(friendRequestId).pipe((0, operators_1.switchMap)((friendRequest) => {
            return (0, rxjs_1.from)(this.friendRequestRepository.save(Object.assign(Object.assign({}, friendRequest), { status: statusRespose })));
        }));
    }
    getFriendRequestsFromRecipients(currentUser) {
        return (0, rxjs_1.from)(this.friendRequestRepository.find({
            where: [{ receiver: currentUser }],
            relations: ['receiver', 'creator'],
        }));
    }
    getFriends(currentUser) {
        return (0, rxjs_1.from)(this.friendRequestRepository.find({
            where: [
                { creator: currentUser, status: 'accepted' },
                { receiver: currentUser, status: 'accepted' },
            ],
            relations: ['creator', 'receiver'],
        })).pipe((0, operators_1.switchMap)((friends) => {
            let userIds = [];
            friends.forEach((friend) => {
                if (friend.creator.id === currentUser.id) {
                    userIds.push(friend.receiver.id);
                }
                else if (friend.receiver.id === currentUser.id) {
                    userIds.push(friend.creator.id);
                }
            });
            return (0, rxjs_1.from)(this.userRepository.findByIds(userIds));
        }));
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(friend_request_entity_1.FriendRequestEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map