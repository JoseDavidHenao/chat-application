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
exports.IsCreatorGuard = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const user_service_1 = require("../../auth/services/user.service");
const feed_service_1 = require("../services/feed.service");
let IsCreatorGuard = class IsCreatorGuard {
    constructor(userService, feedService) {
        this.userService = userService;
        this.feedService = feedService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { user, params } = request;
        if (!user || !params)
            return false;
        if (user.role === 'admin')
            return true;
        const userId = user.id;
        const feedId = params.id;
        return this.userService.findUserById(userId).pipe((0, rxjs_1.switchMap)((user) => this.feedService.findPostById(feedId).pipe((0, rxjs_1.map)((feedPost) => {
            let isAuthor = user.id === feedPost.author.id;
            return isAuthor;
        }))));
    }
};
IsCreatorGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        feed_service_1.FeedService])
], IsCreatorGuard);
exports.IsCreatorGuard = IsCreatorGuard;
//# sourceMappingURL=is-creator.guard.js.map