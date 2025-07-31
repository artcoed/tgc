import { Bot, Context, InlineKeyboard } from 'grammy';
import { env } from '../env';
import { getMessage } from '../i18n';
import { logger } from '../logger';

export function setupHandlers(bot: Bot) {
    bot.command('start', async (ctx: Context) => {
        const lang = ctx.from?.language_code ?? 'en';
        const message = getMessage(lang, 'start-message');
        const buttonText = getMessage(lang, 'open-app');

        const keyboard = new InlineKeyboard().webApp(buttonText, `${env.TELEGRAM_WEB_APP_URL}?lang=${lang}`);

        await ctx.reply(message, { reply_markup: keyboard });
        logger.info(`Handled /start for bot ${bot.botInfo.username}`);
    });

    // Add more handlers if needed
}