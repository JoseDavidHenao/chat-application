"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("./services/auth.service");
const auth_controller_1 = require("./controllers/auth.controller");
const user_entity_1 = require("./models/user.entity");
const jwt_1 = require("@nestjs/jwt");
const jwt_guard_1 = require("./guards/jwt.guard");
const jwt_strategy_1 = require("./guards/jwt.strategy");
const roles_guard_1 = require("./guards/roles.guard");
const user_service_1 = require("./services/user.service");
const user_controller_1 = require("./controllers/user.controller");
const friend_request_entity_1 = require("./models/friend-request.entity");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '3600s' },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, friend_request_entity_1.FriendRequestEntity]),
        ],
        providers: [auth_service_1.AuthService, jwt_guard_1.JwtGuard, jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard, user_service_1.UserService],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController],
        exports: [auth_service_1.AuthService, user_service_1.UserService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map