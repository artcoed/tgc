const { db } = require('./dist/db/index');

async function createDefaultBot() {
    try {
        // Проверяем, есть ли уже бот с ID=1
        const existingBot = await db.selectFrom('bots').where('id', '=', 1).executeTakeFirst();
        
        if (existingBot) {
            console.log('Bot with ID=1 already exists:', existingBot);
            return;
        }

        // Создаем дефолтного бота
        await db.insertInto('bots').values({
            id: 1,
            name: 'Default Bot',
            token: 'default_token',
            created_at: new Date()
        }).execute();

        console.log('Successfully created default bot with ID=1');
    } catch (error) {
        console.error('Error creating default bot:', error);
    } finally {
        await db.destroy();
    }
}

createDefaultBot(); 