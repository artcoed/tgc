import { UserRepository } from '../db/repositories/UserRepository';

export type RouletteColor = 'black' | 'red' | 'green';

export interface RouletteResult {
    number: number;
    color: RouletteColor;
    isWin: boolean;
    multiplier: number;
    winAmount: number;
    newBalance: number;
    attemptsLeft: number;
}

export class RouletteService {
    private userRepo: UserRepository;
    
    // Европейская рулетка: числа 0-36
    private readonly numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    
    private readonly colorMap: { [key: number]: RouletteColor } = {
        0: 'green',
        32: 'red', 15: 'black', 19: 'red', 4: 'black', 21: 'red', 2: 'black', 25: 'red',
        17: 'black', 34: 'red', 6: 'black', 27: 'red', 13: 'black', 36: 'red', 11: 'black',
        30: 'red', 8: 'black', 23: 'red', 10: 'black', 5: 'red', 24: 'black', 16: 'red',
        33: 'black', 1: 'red', 20: 'black', 14: 'red', 31: 'black', 9: 'red', 22: 'black',
        18: 'red', 29: 'black', 7: 'red', 28: 'black', 12: 'red', 35: 'black', 3: 'red',
        26: 'black'
    };

    constructor() {
        this.userRepo = new UserRepository();
    }

    private getMultiplier(color: RouletteColor): number {
        return color === 'green' ? 10 : 2;
    }

    private generateResult(): { number: number; color: RouletteColor } {
        const randomIndex = Math.floor(Math.random() * this.numbers.length);
        const number = this.numbers[randomIndex];
        const color = this.colorMap[number];
        return { number, color };
    }

    private async resetDailyAttemptsIfNeeded(telegramId: number, botId: number): Promise<void> {
        const user = await this.userRepo.findByTelegramId(telegramId, botId);
        if (!user) return;

        const today = new Date().toDateString();
        const lastResetDate = user.roulette_last_reset_date.toDateString();

        if (today !== lastResetDate) {
            await this.userRepo.updateByTelegramId(telegramId, botId, {
                roulette_daily_attempts: 5,
                roulette_last_reset_date: new Date(),
            });
        }
    }

    async placeBet(telegramId: number, botId: number, betAmount: number, betColor: RouletteColor): Promise<RouletteResult> {
        // Проверяем и сбрасываем дневные попытки если нужно
        await this.resetDailyAttemptsIfNeeded(telegramId, botId);

        const user = await this.userRepo.findByTelegramId(telegramId, botId);
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
        const updates: any = {
            balance: newBalance,
            roulette_daily_attempts: user.roulette_daily_attempts - 1,
        };

        if (isWin) {
            updates.roulette_total_wins = user.roulette_total_wins + 1;
            updates.roulette_total_winnings = user.roulette_total_winnings + winAmount;
        } else {
            updates.roulette_total_losses = user.roulette_total_losses + 1;
        }

        await this.userRepo.updateByTelegramId(telegramId, botId, updates);

        return {
            number: result.number,
            color: result.color,
            isWin,
            multiplier,
            winAmount,
            newBalance,
            attemptsLeft: user.roulette_daily_attempts - 1,
        };
    }

    async getUserRouletteInfo(telegramId: number, botId: number): Promise<{
        balance: number;
        currency: string;
        attemptsLeft: number;
        totalWins: number;
        totalLosses: number;
        totalWinnings: number;
    }> {
        await this.resetDailyAttemptsIfNeeded(telegramId, botId);
        
        const user = await this.userRepo.findByTelegramId(telegramId, botId);
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
    }
} 