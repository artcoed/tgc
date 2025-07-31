import { Bot } from 'grammy';
import { BotRepository } from '../db/repositories/BotRepository';
import { setupHandlers } from './handlers';
import { logger } from '../logger';

const botRepo = new BotRepository();
const activeBots: Map<string, Bot> = new Map();

export async function loadBots() {
    const bots = await botRepo.getAll();
    for (const { token } of bots) {
        if (activeBots.has(token)) continue;
        const bot = new Bot(token);
        setupHandlers(bot);
        await bot.start(); // Start polling for each bot
        activeBots.set(token, bot);
        logger.info(`Started bot with token ending ${token.slice(-6)}`);
    }
}

export async function addBotAndStart(name: string, token: string) {
    const newBot = await botRepo.add({ name, token });
    const bot = new Bot(token);
    setupHandlers(bot);
    await bot.start();
    activeBots.set(token, bot);
    logger.info(`Added and started new bot: ${newBot.name}`);
    return newBot;
}

export async function removeBotAndStop(id: number) {
    const bot = await botRepo.getById(id);
    if (!bot) return;
    const activeBot = activeBots.get(bot.token);
    if (activeBot) {
        await activeBot.stop();
        activeBots.delete(bot.token);
        logger.info(`Stopped bot: ${bot.name}`);
    }
    await botRepo.remove(id);
}