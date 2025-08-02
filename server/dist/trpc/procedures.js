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
exports.rouletteProcedures = exports.userProcedures = exports.botProcedures = void 0;
const zod_1 = require("zod");
const router_1 = require("./router");
const manager_1 = require("../bots/manager");
const BotRepository_1 = require("../db/repositories/BotRepository");
const UserRepository_1 = require("../db/repositories/UserRepository");
const RouletteService_1 = require("../services/RouletteService");
const botRepo = new BotRepository_1.BotRepository();
const userRepo = new UserRepository_1.UserRepository();
const rouletteService = new RouletteService_1.RouletteService();
exports.botProcedures = (0, router_1.router)({
    internal: (0, router_1.router)({
        bot: {
            listBots: router_1.publicProcedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
                return botRepo.getAll();
            })),
            addBot: router_1.publicProcedure
                .input(zod_1.z.object({ name: zod_1.z.string(), token: zod_1.z.string() }))
                .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
                return (0, manager_1.addBotAndStart)(input.name, input.token);
            })),
            removeBot: router_1.publicProcedure
                .input(zod_1.z.object({ id: zod_1.z.number() }))
                .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
                yield (0, manager_1.removeBotAndStop)(input.id);
                return { success: true };
            })),
        },
    }),
});
exports.userProcedures = (0, router_1.router)({
    // Получить информацию о текущем пользователе
    getCurrentUser: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number()
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        return userRepo.findByTelegramId(input.telegramId, input.botId);
    })),
    // Проверить, зарегистрирован ли пользователь
    isUserRegistered: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number()
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        return userRepo.isFullyRegistered(input.telegramId, input.botId);
    })),
    // Создать или обновить пользователя из Telegram Web Apps
    upsertUserFromTelegram: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        username: zod_1.z.string().optional(),
        languageCode: zod_1.z.string().optional(),
        isPremium: zod_1.z.boolean().optional(),
        allowsWriteToPm: zod_1.z.boolean().optional(),
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        var _b, _c;
        const existingUser = yield userRepo.findByTelegramId(input.telegramId, input.botId);
        if (existingUser) {
            // Обновляем существующего пользователя
            return userRepo.updateByTelegramId(input.telegramId, input.botId, {
                first_name: input.firstName || existingUser.first_name,
                last_name: input.lastName || existingUser.last_name,
                username: input.username || existingUser.username,
                language_code: input.languageCode || existingUser.language_code,
                is_premium: (_b = input.isPremium) !== null && _b !== void 0 ? _b : existingUser.is_premium,
                allows_write_to_pm: (_c = input.allowsWriteToPm) !== null && _c !== void 0 ? _c : existingUser.allows_write_to_pm,
            });
        }
        else {
            // Создаем нового пользователя
            return userRepo.create({
                telegram_id: input.telegramId,
                bot_id: input.botId,
                first_name: input.firstName || null,
                last_name: input.lastName || null,
                username: input.username || null,
                language_code: input.languageCode || null,
                is_premium: input.isPremium || false,
                allows_write_to_pm: input.allowsWriteToPm || false,
                full_name: null,
                age: null,
                city: null,
                phone: null,
                iban: null,
                balance: 1000.00,
                currency: 'EUR',
                roulette_daily_attempts: 5,
                roulette_last_reset_date: new Date(),
                roulette_total_wins: 0,
                roulette_total_losses: 0,
                roulette_total_winnings: 0.00,
            });
        }
    })),
    // Завершить регистрацию пользователя
    completeRegistration: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number(),
        fullName: zod_1.z.string(),
        age: zod_1.z.number(),
        city: zod_1.z.string(),
        phone: zod_1.z.string(),
        iban: zod_1.z.string(),
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        return userRepo.updateByTelegramId(input.telegramId, input.botId, {
            full_name: input.fullName,
            age: input.age,
            city: input.city,
            phone: input.phone,
            iban: input.iban,
        });
    })),
    // Получить баланс пользователя
    getUserBalance: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number()
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        // Пока возвращаем моковые данные
        // В будущем здесь будет логика получения баланса из базы данных
        return {
            balance: 0.00,
            currency: 'EUR',
            dailyChange: 5.21,
            exchangeRate: 1.135,
        };
    })),
    // Получить статистику пользователя
    getUserStats: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number()
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const user = yield userRepo.findByTelegramId(input.telegramId, input.botId);
        if (!user)
            return null;
        // Пока возвращаем моковые данные
        return {
            daysInProject: user.created_at ?
                Math.ceil((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
            totalTrades: 0,
            successfulTrades: 0,
            totalWinnings: 0.00,
            status: 'Партнер',
        };
    })),
});
exports.rouletteProcedures = (0, router_1.router)({
    // Получить информацию о рулетке для пользователя
    getRouletteInfo: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number()
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        return rouletteService.getUserRouletteInfo(input.telegramId, input.botId);
    })),
    // Сделать ставку в рулетке
    placeBet: router_1.publicProcedure
        .input(zod_1.z.object({
        telegramId: zod_1.z.number(),
        botId: zod_1.z.number(),
        betAmount: zod_1.z.number().min(10),
        betColor: zod_1.z.enum(['black', 'red', 'green']),
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        return rouletteService.placeBet(input.telegramId, input.botId, input.betAmount, input.betColor);
    })),
});
