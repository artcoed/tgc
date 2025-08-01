import { z } from 'zod';
import { publicProcedure } from './router';
import { addBotAndStart, removeBotAndStop } from '../bots/manager';
import { BotRepository } from '../db/repositories/BotRepository';
import { UserRepository } from '../db/repositories/UserRepository';

const botRepo = new BotRepository();
const userRepo = new UserRepository();

export const botProcedures = {
    listBots: publicProcedure.query(async () => {
        return botRepo.getAll();
    }),

    addBot: publicProcedure
        .input(z.object({ name: z.string(), token: z.string() }))
        .mutation(async ({ input }) => {
            return addBotAndStart(input.name, input.token);
        }),

    removeBot: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            await removeBotAndStop(input.id);
            return { success: true };
        }),
};

export const userProcedures = {
    // Получить информацию о текущем пользователе
    getCurrentUser: publicProcedure
        .input(z.object({ telegramId: z.number() }))
        .query(async ({ input }) => {
            return userRepo.findByTelegramId(input.telegramId);
        }),

    // Проверить, зарегистрирован ли пользователь
    isUserRegistered: publicProcedure
        .input(z.object({ telegramId: z.number() }))
        .query(async ({ input }) => {
            return userRepo.isFullyRegistered(input.telegramId);
        }),

    // Создать или обновить пользователя из Telegram Web Apps
    upsertUserFromTelegram: publicProcedure
        .input(z.object({
            telegramId: z.number(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            username: z.string().optional(),
            languageCode: z.string().optional(),
            isPremium: z.boolean().optional(),
            allowsWriteToPm: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
            const existingUser = await userRepo.findByTelegramId(input.telegramId);
            
            if (existingUser) {
                // Обновляем существующего пользователя
                return userRepo.updateByTelegramId(input.telegramId, {
                    first_name: input.firstName || existingUser.first_name,
                    last_name: input.lastName || existingUser.last_name,
                    username: input.username || existingUser.username,
                    language_code: input.languageCode || existingUser.language_code,
                    is_premium: input.isPremium ?? existingUser.is_premium,
                    allows_write_to_pm: input.allowsWriteToPm ?? existingUser.allows_write_to_pm,
                });
            } else {
                // Создаем нового пользователя
                return userRepo.create({
                    telegram_id: input.telegramId,
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
                });
            }
        }),

    // Завершить регистрацию пользователя
    completeRegistration: publicProcedure
        .input(z.object({
            telegramId: z.number(),
            fullName: z.string(),
            age: z.number(),
            city: z.string(),
            phone: z.string(),
            iban: z.string(),
        }))
        .mutation(async ({ input }) => {
            return userRepo.updateByTelegramId(input.telegramId, {
                full_name: input.fullName,
                age: input.age,
                city: input.city,
                phone: input.phone,
                iban: input.iban,
            });
        }),

    // Получить баланс пользователя
    getUserBalance: publicProcedure
        .input(z.object({ telegramId: z.number() }))
        .query(async ({ input }) => {
            // Пока возвращаем моковые данные
            // В будущем здесь будет логика получения баланса из базы данных
            return {
                balance: 0.00,
                currency: 'EUR',
                dailyChange: 5.21,
                exchangeRate: 1.135,
            };
        }),

    // Получить статистику пользователя
    getUserStats: publicProcedure
        .input(z.object({ telegramId: z.number() }))
        .query(async ({ input }) => {
            const user = await userRepo.findByTelegramId(input.telegramId);
            if (!user) return null;

            // Пока возвращаем моковые данные
            return {
                daysInProject: user.created_at ? 
                    Math.ceil((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
                totalTrades: 0,
                successfulTrades: 0,
                totalWinnings: 0.00,
                status: 'Партнер',
            };
        }),
};