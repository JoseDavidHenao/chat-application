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
exports.ConversationEntity = void 0;
const user_entity_1 = require("../../auth/models/user.entity");
const typeorm_1 = require("typeorm");
const message_entity_1 = require("./message.entity");
let ConversationEntity = class ConversationEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConversationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ConversationEntity.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.MessageEntity, (messageEntity) => messageEntity.conversation),
    __metadata("design:type", Array)
], ConversationEntity.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ConversationEntity.prototype, "lastUpdated", void 0);
ConversationEntity = __decorate([
    (0, typeorm_1.Entity)('conversation')
], ConversationEntity);
exports.ConversationEntity = ConversationEntity;
//# sourceMappingURL=conversation.entity.js.map