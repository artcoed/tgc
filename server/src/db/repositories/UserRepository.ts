import { db } from '../index';
import type { Database } from '../types';

type User = Database['users'];
type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
    balance?: number;
    currency?: string;
    roulette_daily_attempts?: number;
    roulette_last_reset_date?: Date;
    roulette_total_wins?: number;
    roulette_total_losses?: number;
    roulette_total_winnings?: number;
};
type UpdateUser = Partial<Omit<User, 'id' | 'telegram_id' | 'created_at' | 'updated_at'>>;

// Тип для результата запросов Kysely
type UserResult = {
    id: number;
    telegram_id: number;
    bot_id: number;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    language_code: string | null;
    is_premium: boolean;
    allows_write_to_pm: boolean;
    full_name: string | null;
    age: number | null;
    city: string | null;
    phone: string | null;
    iban: string | null;
    balance: number;
    currency: string;
    roulette_daily_attempts: number;
    roulette_last_reset_date: Date;
    roulette_total_wins: number;
    roulette_total_losses: number;
    roulette_total_winnings: number;
    created_at: Date;
    updated_at: Date;
};

export class UserRepository {
    async create(user: NewUser): Promise<UserResult> {
        const [createdUser] = await db
            .insertInto('users')
            .values(user)
            .returningAll()
            .execute();
        return createdUser;
    }

    async findByTelegramId(telegramId: number, botId: number): Promise<UserResult | null> {
        const user = await db
            .selectFrom('users')
            .selectAll()
            .where('telegram_id', '=', telegramId)
            .where('bot_id', '=', botId)
            .executeTakeFirst();
        return user || null;
    }

    async updateByTelegramId(telegramId: number, botId: number, updates: UpdateUser): Promise<UserResult | null> {
        const [updatedUser] = await db
            .updateTable('users')
            .set({
                ...updates,
                updated_at: new Date(),
            })
            .where('telegram_id', '=', telegramId)
            .where('bot_id', '=', botId)
            .returningAll()
            .execute();
        return updatedUser || null;
    }

    async exists(telegramId: number, botId: number): Promise<boolean> {
        const user = await db
            .selectFrom('users')
            .select('id')
            .where('telegram_id', '=', telegramId)
            .where('bot_id', '=', botId)
            .executeTakeFirst();
        return !!user;
    }

    async isFullyRegistered(telegramId: number, botId: number): Promise<boolean> {
        const user = await this.findByTelegramId(telegramId, botId);
        if (!user) return false;
        
        return !!(user.full_name && user.age && user.city && user.phone && user.iban);
    }
} 