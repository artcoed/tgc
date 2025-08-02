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
exports.setupHandlers = setupHandlers;
const grammy_1 = require("grammy");
const env_1 = require("../env");
const i18n_1 = require("../i18n");
const logger_1 = require("../logger");
function setupHandlers(bot) {
    bot.command('start', (ctx) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const lang = (_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.language_code) !== null && _b !== void 0 ? _b : 'en';
        const message = (0, i18n_1.getMessage)(lang, 'start-message');
        const buttonText = (0, i18n_1.getMessage)(lang, 'open-app');
        const keyboard = new grammy_1.InlineKeyboard().webApp(buttonText, `${env_1.env.TELEGRAM_WEB_APP_URL}?lang=${lang}`);
        yield ctx.reply(message, { reply_markup: keyboard });
        logger_1.logger.info(`Handled /start for bot ${bot.botInfo.username}`);
    }));
    // Add more handlers if needed
}
