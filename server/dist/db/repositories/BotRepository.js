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
exports.BotRepository = void 0;
const index_1 = require("../index");
class BotRepository {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.db.selectFrom('bots').selectAll().execute();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.db.selectFrom('bots').selectAll().where('id', '=', id).executeTakeFirst();
        });
    }
    getByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.db.selectFrom('bots').selectAll().where('token', '=', token).executeTakeFirst();
        });
    }
    add(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.db
                .insertInto('bots')
                .values(bot)
                .returningAll()
                .executeTakeFirstOrThrow();
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_1.db.deleteFrom('bots').where('id', '=', id).execute();
        });
    }
}
exports.BotRepository = BotRepository;
