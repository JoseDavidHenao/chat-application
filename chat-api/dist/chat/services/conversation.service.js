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
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const user_class_1 = require("../../auth/models/user.class");
const typeorm_2 = require("typeorm");
const active_conversation_entity_1 = require("../models/active-conversation.entity");
const conversation_entity_1 = require("../models/conversation.entity");
const message_entity_1 = require("../models/message.entity");
let ConversationService = class ConversationService {
    constructor(conversationRepository, activeConversationRepository, messageRepository) {
        this.conversationRepository = conversationRepository;
        this.activeConversationRepository = activeConversationRepository;
        this.messageRepository = messageRepository;
    }
    getConversation(creatorId, friendId) {
        return (0, rxjs_1.from)(this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoin('conversation.users', 'user')
            .where('user.id = :creatorId', { creatorId })
            .orWhere('user.id = :friendId', { friendId })
            .groupBy('conversation.id')
            .having('COUNT(*) > 1')
            .getOne()).pipe((0, rxjs_1.map)((conversation) => conversation || undefined));
    }
    createConversation(creator, friend) {
        return this.getConversation(creator.id, friend.id).pipe((0, rxjs_1.switchMap)((conversation) => {
            const doesConversationExist = !!conversation;
            if (!doesConversationExist) {
                const newConversation = {
                    users: [creator, friend],
                };
                return (0, rxjs_1.from)(this.conversationRepository.save(newConversation));
            }
            return (0, rxjs_1.of)(conversation);
        }));
    }
    getConversationsForUser(userId) {
        return (0, rxjs_1.from)(this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoin('conversation.users', 'user')
            .where('user.id = :userId', { userId })
            .orderBy('conversation.lastUpdated', 'DESC')
            .getMany());
    }
    getUsersInConversation(conversationId) {
        return (0, rxjs_1.from)(this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoinAndSelect('conversation.users', 'user')
            .where('conversation.id = :conversationId', { conversationId })
            .getMany());
    }
    getConversationsWithUsers(userId) {
        return this.getConversationsForUser(userId).pipe((0, rxjs_1.take)(1), (0, rxjs_1.switchMap)((conversations) => conversations), (0, rxjs_1.mergeMap)((conversation) => {
            return this.getUsersInConversation(conversation.id);
        }));
    }
    joinConversation(friendId, userId, socketId) {
        return this.getConversation(userId, friendId).pipe((0, rxjs_1.switchMap)((conversation) => {
            if (!conversation) {
                console.warn(`No conversation exists for userId: ${userId} and friendId: ${friendId}`);
                return (0, rxjs_1.of)();
            }
            const conversationId = conversation.id;
            return (0, rxjs_1.from)(this.activeConversationRepository.findOne({ userId })).pipe((0, rxjs_1.switchMap)((activeConversation) => {
                if (activeConversation) {
                    return (0, rxjs_1.from)(this.activeConversationRepository.delete({ userId })).pipe((0, rxjs_1.switchMap)(() => {
                        return (0, rxjs_1.from)(this.activeConversationRepository.save({
                            socketId,
                            userId,
                            conversationId,
                        }));
                    }));
                }
                else {
                    return (0, rxjs_1.from)(this.activeConversationRepository.save({
                        socketId,
                        userId,
                        conversationId,
                    }));
                }
            }));
        }));
    }
    leaveConversation(socketId) {
        return (0, rxjs_1.from)(this.activeConversationRepository.delete({ socketId }));
    }
    getActiveUsers(conversationId) {
        return (0, rxjs_1.from)(this.activeConversationRepository.find({
            where: [{ conversationId }],
        }));
    }
    createMessage(message) {
        return (0, rxjs_1.from)(this.messageRepository.save(message));
    }
    getMessages(conversationId) {
        return (0, rxjs_1.from)(this.messageRepository
            .createQueryBuilder('message')
            .innerJoinAndSelect('message.user', 'user')
            .where('message.conversation.id =:conversationId', { conversationId })
            .orderBy('message.createdAt', 'ASC')
            .getMany());
    }
    removeActiveConversations() {
        return (0, rxjs_1.from)(this.activeConversationRepository.createQueryBuilder().delete().execute());
    }
    removeMessages() {
        return (0, rxjs_1.from)(this.messageRepository.createQueryBuilder().delete().execute());
    }
    removeConversations() {
        return (0, rxjs_1.from)(this.conversationRepository.createQueryBuilder().delete().execute());
    }
};
ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.ConversationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(active_conversation_entity_1.ActiveConversationEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.MessageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ConversationService);
exports.ConversationService = ConversationService;
//# sourceMappingURL=conversation.service.js.map