"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const index_1 = require("../index");
class UserRepository {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [createdUser] = yield index_1.db
                .insertInto('users')
                .values(user)
                .returningAll()
                .execute();
            return createdUser;
        });
    }
    findByTelegramId(telegramId, botId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield index_1.db
                .selectFrom('users')
                .selectAll()
                .where('telegram_id', '=', telegramId)
                .where('bot_id', '=', botId)
                .executeTakeFirst();
            return user || null;
        });
    }
    updateByTelegramId(telegramId, botId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedUser] = yield index_1.db
                .updateTable('users')
                .set(Object.assign(Object.assign({}, updates), { updated_at: new Date() }))
                .where('telegram_id', '=', telegramId)
                .where('bot_id', '=', botId)
                .returningAll()
                .execute();
            return updatedUser || null;
        });
    }
    exists(telegramId, botId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield index_1.db
                .selectFrom('users')
                .select('id')
                .where('telegram_id', '=', telegramId)
                .where('bot_id', '=', botId)
                .executeTakeFirst();
            return !!user;
        });
    }
    isFullyRegistered(telegramId, botId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByTelegramId(telegramId, botId);
            if (!user)
                return false;
            return !!(user.full_name && user.age && user.city && user.phone && user.iban);
        });
    }
}
exports.UserRepository = UserRepository;
