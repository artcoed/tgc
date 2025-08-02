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
exports.RouletteService = void 0;
const UserRepository_1 = require("../db/repositories/UserRepository");
class RouletteService {
    constructor() {
        // Европейская рулетка: числа 0-36
        this.numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        this.colorMap = {
            0: 'green',
            32: 'red', 15: 'black', 19: 'red', 4: 'black', 21: 'red', 2: 'black', 25: 'red',
            17: 'black', 34: 'red', 6: 'black', 27: 'red', 13: 'black', 36: 'red', 11: 'black',
            30: 'red', 8: 'black', 23: 'red', 10: 'black', 5: 'red', 24: 'black', 16: 'red',
            33: 'black', 1: 'red', 20: 'black', 14: 'red', 31: 'black', 9: 'red', 22: 'black',
            18: 'red', 29: 'black', 7: 'red', 28: 'black', 12: 'red', 35: 'black', 3: 'red',
            26: 'black'
        };
        this.userRepo = new UserRepository_1.UserRepository();
    }
    getMultiplier(color) {
        return color === 'green' ? 10 : 2;
    }
    generateResult() {
        const randomIndex = Math.floor(Math.random() * this.numbers.length);
        const number = this.numbers[randomIndex];
        const color = this.colorMap[number];
        return { number, color };
    }
    resetDailyAttemptsIfNeeded(telegramId, botId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findByTelegramId(telegramId, botId);
            if (!user)
                return;
            const today = new Date().toDateString();
            const lastResetDate = user.roulette_last_reset_date.toDateString();
            if (today !== lastResetDate) {
                yield this.userRepo.updateByTelegramId(telegramId, botId, {
                    roulette_daily_attempts: 5,
                    roulette_last_reset_date: new Date(),
                });
            }
        });
    }
    placeBet(telegramId, botId, betAmount, betColor) {
        return __awaiter(this, void 0, void 0, function* () {
            // Проверяем и сбрасываем дневные попытки если нужно
            yield this.resetDailyAttemptsIfNeeded(telegramId, botId);
            const user = yield this.userRepo.findByTelegramId(telegramId, botId);
            if (!user) {
                throw new Error('Пользователь не найден');
            }
            // Проверяем баланс
            if (user.balance < betAmount) {
                throw new Error('Недостаточно средств');
            }
            // Проверяем количество попыток
            if (user.roulette_daily_attempts <= 0) {
                throw new Error('Дневной лимит попыток исчерпан');
            }
            // Проверяем минимальную и максимальную ставку
            if (betAmount < 10) {
                throw new Error('Минимальная ставка: 10');
            }
            if (betAmount > user.balance * 0.95) { // Максимум 95% от баланса
                throw new Error('Максимальная ставка превышает доступные средства');
            }
            // Генерируем результат
            const result = this.generateResult();
            const multiplier = this.getMultiplier(betColor);
            const isWin = result.color === betColor;
            const winAmount = isWin ? betAmount * multiplier : 0;
            const newBalance = user.balance - betAmount + winAmount;
            // Обновляем статистику пользователя
            const updates = {
                balance: newBalance,
                roulette_daily_attempts: user.roulette_daily_attempts - 1,
            };
            if (isWin) {
                updates.roulette_total_wins = user.roulette_total_wins + 1;
                updates.roulette_total_winnings = user.roulette_total_winnings + winAmount;
            }
            else {
                updates.roulette_total_losses = user.roulette_total_losses + 1;
            }
            yield this.userRepo.updateByTelegramId(telegramId, botId, updates);
            return {
                number: result.number,
                color: result.color,
                isWin,
                multiplier,
                winAmount,
                newBalance,
                attemptsLeft: user.roulette_daily_attempts - 1,
            };
        });
    }
    getUserRouletteInfo(telegramId, botId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resetDailyAttemptsIfNeeded(telegramId, botId);
            const user = yield this.userRepo.findByTelegramId(telegramId, botId);
            if (!user) {
                throw new Error('Пользователь не найден');
            }
            return {
                balance: user.balance,
                currency: user.currency,
                attemptsLeft: user.roulette_daily_attempts,
                totalWins: user.roulette_total_wins,
                totalLosses: user.roulette_total_losses,
                totalWinnings: user.roulette_total_winnings,
            };
        });
    }
}
exports.RouletteService = RouletteService;
