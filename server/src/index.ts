import { env } from './env';
import { createServer } from './server';
import { logger } from './logger';
import { exec } from 'child_process';
import { promisify } from 'util';
import {loadBots} from "./bots/manager";

const execAsync = promisify(exec);

async function main() {
    try {
        await execAsync('npm run migrate');
        logger.info('Migrations completed successfully');
    } catch (err) {
        logger.error('Migration failed:', err);
        process.exit(1);
    }

    const server = createServer();
    await loadBots(); // Временно отключено для тестирования
    server.listen(env.PORT);
    logger.info(`tRPC server running on port ${env.PORT}`);
}

main().catch((err) => {
    logger.error(err);
    process.exit(1);
});