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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const rxjs_1 = require("rxjs");
const socket_io_1 = require("socket.io");
const jwt_guard_1 = require("../../auth/guards/jwt.guard");
const user_class_1 = require("../../auth/models/user.class");
const auth_service_1 = require("../../auth/services/auth.service");
const conversation_service_1 = require("../services/conversation.service");
let ChatGateway = class ChatGateway {
    constructor(authService, conversationService) {
        this.authService = authService;
        this.conversationService = conversationService;
    }
    onModuleInit() {
        this.conversationService
            .removeActiveConversations()
            .pipe((0, rxjs_1.take)(1))
            .subscribe();
        this.conversationService.removeMessages().pipe((0, rxjs_1.take)(1)).subscribe();
        this.conversationService.removeConversations().pipe((0, rxjs_1.take)(1)).subscribe();
    }
    handleConnection(socket) {
        console.log('HANDLE CONNECTION');
        const jwt = socket.handshake.headers.authorization || null;
        this.authService.getJwtUser(jwt).subscribe((user) => {
            if (!user) {
                console.log('NO USER');
                this.handleDisconnect(socket);
            }
            else {
                socket.data.user = user;
                this.getConversations(socket, user.id);
            }
        });
    }
    getConversations(socket, userId) {
        return this.conversationService
            .getConversationsWithUsers(userId)
            .subscribe((conversations) => {
            this.server.to(socket.id).emit('conversations', conversations);
        });
    }
    handleDisconnect(socket) {
        console.log('HANDLE DISCONNECT');
        this.conversationService
            .leaveConversation(socket.id)
            .pipe((0, rxjs_1.take)(1))
            .subscribe();
    }
    createConversation(socket, friend) {
        this.conversationService
            .createConversation(socket.data.user, friend)
            .pipe((0, rxjs_1.take)(1))
            .subscribe(() => {
            this.getConversations(socket, socket.data.user.id);
        });
    }
    handleMessage(socket, newMessage) {
        if (!newMessage.conversation)
            return (0, rxjs_1.of)(null);
        const { user } = socket.data;
        newMessage.user = user;
        if (newMessage.conversation.id) {
            this.conversationService
                .createMessage(newMessage)
                .pipe((0, rxjs_1.take)(1))
                .subscribe((message) => {
                newMessage.id = message.id;
                this.conversationService
                    .getActiveUsers(newMessage.conversation.id)
                    .pipe((0, rxjs_1.take)(1))
                    .subscribe((activeCAonversations) => {
                    activeCAonversations.forEach((activeConversation) => {
                        this.server
                            .to(activeConversation.socketId)
                            .emit('newMessage', newMessage);
                    });
                });
            });
        }
    }
    joinConversation(socket, friendId) {
        this.conversationService
            .joinConversation(friendId, socket.data.user.id, socket.id)
            .pipe((0, rxjs_1.tap)((activeConversation) => {
            this.conversationService
                .getMessages(activeConversation.conversationId)
                .pipe((0, rxjs_1.take)(1))
                .subscribe((messages) => {
                this.server.to(socket.id).emit('messages', messages);
            });
        }))
            .pipe((0, rxjs_1.take)(1))
            .subscribe();
    }
    leaveConversation(socket) {
        this.conversationService
            .leaveConversation(socket.id)
            .pipe((0, rxjs_1.take)(1))
            .subscribe();
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createConversation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, user_class_1.User]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "createConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "joinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveConversation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "leaveConversation", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: ['http://localhost:8100'] } }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        conversation_service_1.ConversationService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map