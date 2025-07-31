import { z } from 'zod';
import { publicProcedure } from './router';
import { addBotAndStart, removeBotAndStop } from '../bots/manager';
import { BotRepository } from '../db/repositories/BotRepository';

const botRepo = new BotRepository();

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