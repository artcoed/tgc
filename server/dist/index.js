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
const env_1 = require("./env");
const server_1 = require("./server");
const logger_1 = require("./logger");
const child_process_1 = require("child_process");
const util_1 = require("util");
const manager_1 = require("./bots/manager");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield execAsync('npm run migrate');
            logger_1.logger.info('Migrations completed successfully');
        }
        catch (err) {
            logger_1.logger.error('Migration failed:', err);
            process.exit(1);
        }
        const server = (0, server_1.createServer)();
        yield (0, manager_1.loadBots)(); // Временно отключено для тестирования
        server.listen(env_1.env.PORT);
        logger_1.logger.info(`tRPC server running on port ${env_1.env.PORT}`);
    });
}
main().catch((err) => {
    logger_1.logger.error(err);
    process.exit(1);
});
