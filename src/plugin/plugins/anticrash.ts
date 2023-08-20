import { BotPlugin } from '../types.js';
import { Navi } from '../../structures/index.js';


const antiCrash: BotPlugin = {
    name: 'AntiCrash Plugin',
    version: '1.0.0',
    author: 'Blacky',
    initialize: (client: Navi) => {
        process.on('unhandledRejection', (reason, promise) => {
            client.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });
        process.on('uncaughtException', (err) => {
            client.logger.error('Uncaught Exception thrown:', err);
        });
        const handleExit = async () => {
            if (client) {
                client.logger.star('Disconnecting from Discord...');
                await client.destroy();
                client.logger.success('Successfully disconnected from Discord!');
                process.exit();
            }
        };
        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
        process.on('SIGQUIT', handleExit);
    }
}

export default antiCrash;