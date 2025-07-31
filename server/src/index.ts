import { env } from './env';
import { createServer } from './server';
import { loadBots } from './bots/manager';
import { logger } from './logger';
import { exec } from 'child_process';
import { promisify } from 'util';

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
    await loadBots();
    server.listen(env.PORT);
    logger.info(`tRPC server running on port ${env.PORT}`);
}

main().catch((err) => {
    logger.error(err);
    process.exit(1);
});