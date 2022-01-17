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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const jwt_guard_1 = require("../guards/jwt.guard");
const image_storage_1 = require("../helpers/image-storage");
const user_service_1 = require("../services/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    uploadImage(file, req) {
        const fileName = file === null || file === void 0 ? void 0 : file.filename;
        if (!fileName)
            return (0, rxjs_1.of)({ error: 'File must be a png, jpg/jpeg' });
        const imagesFolderPath = (0, path_1.join)(process.cwd(), 'images');
        const fullImagePath = (0, path_1.join)(imagesFolderPath + '/' + file.filename);
        return (0, image_storage_1.isFileExtensionSafe)(fullImagePath).pipe((0, rxjs_1.switchMap)((isFileLegit) => {
            if (isFileLegit) {
                const userId = req.user.id;
                return this.userService.updateUserImageById(userId, fileName).pipe((0, rxjs_1.map)(() => ({
                    modifiedFileName: file.filename,
                })));
            }
            (0, image_storage_1.removeFile)(fullImagePath);
            return (0, rxjs_1.of)({ error: 'File content does not match extension!' });
        }));
    }
    findImage(req, res) {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe((0, rxjs_1.switchMap)((imageName) => {
            return (0, rxjs_1.of)(res.sendFile(imageName, { root: './images' }));
        }));
    }
    findImageImageName(req) {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe((0, rxjs_1.switchMap)((imageName) => {
            return (0, rxjs_1.of)({ imageName });
        }));
    }
    findUserById(userStringId) {
        const userId = parseInt(userStringId);
        return this.userService.findUserById(userId);
    }
    sendFriendRequest(receiverStringId, req) {
        const receiverId = parseInt(receiverStringId);
        return this.userService.sendFriendRequest(receiverId, req.user);
    }
    getFriendRequestStatus(receiverStringId, req) {
        const receiverId = parseInt(receiverStringId);
        return this.userService.getFriendRequestStatus(receiverId, req.user);
    }
    respondToFriendRequest(friendRequestStringId, statusResponse) {
        const friendRequestId = parseInt(friendRequestStringId);
        return this.userService.respondToFriendRequest(statusResponse.status, friendRequestId);
    }
    getFriendRequestsFromRecipients(req) {
        return this.userService.getFriendRequestsFromRecipients(req.user);
    }
    getFriends(req) {
        return this.userService.getFriends(req.user);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', image_storage_1.saveImageToStorage)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('image'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('image-name'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findImageImageName", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)(':friend-request/send/:receiverId'),
    __param(0, (0, common_1.Param)('receiverId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('friend-request/status/:receiverId'),
    __param(0, (0, common_1.Param)('receiverId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "getFriendRequestStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Put)('friend-request/response/:friendRequestId'),
    __param(0, (0, common_1.Param)('friendRequestId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "respondToFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('friend-request/me/received-requests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "getFriendRequestsFromRecipients", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('friends/my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "getFriends", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map