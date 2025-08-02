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
exports.loadBots = loadBots;
exports.addBotAndStart = addBotAndStart;
exports.removeBotAndStop = removeBotAndStop;
const grammy_1 = require("grammy");
const BotRepository_1 = require("../db/repositories/BotRepository");
const handlers_1 = require("./handlers");
const logger_1 = require("../logger");
const botRepo = new BotRepository_1.BotRepository();
const activeBots = new Map();
function loadBots() {
    return __awaiter(this, void 0, void 0, function* () {
        const bots = yield botRepo.getAll();
        for (const { token } of bots) {
            if (activeBots.has(token))
                continue;
            const bot = new grammy_1.Bot(token);
            (0, handlers_1.setupHandlers)(bot);
            bot.start();
            activeBots.set(token, bot);
            logger_1.logger.info(`Started bot with token ending ${token.slice(-6)}`);
        }
    });
}
function addBotAndStart(name, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const newBot = yield botRepo.add({ name, token });
        const bot = new grammy_1.Bot(token);
        (0, handlers_1.setupHandlers)(bot);
        bot.start();
        activeBots.set(token, bot);
        logger_1.logger.info(`Added and started new bot: ${newBot.name}`);
        return newBot;
    });
}
function removeBotAndStop(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const bot = yield botRepo.getById(id);
        if (!bot)
            return;
        const activeBot = activeBots.get(bot.token);
        if (activeBot) {
            yield activeBot.stop();
            activeBots.delete(bot.token);
            logger_1.logger.info(`Stopped bot: ${bot.name}`);
        }
        yield botRepo.remove(id);
    });
}
