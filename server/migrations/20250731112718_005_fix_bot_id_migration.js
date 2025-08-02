/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // Проверяем, есть ли уже колонка bot_id
    const hasBotIdColumn = await knex.schema.hasColumn('users', 'bot_id');
    
    if (!hasBotIdColumn) {
        // Создаем дефолтного бота, если его нет
        const existingBot = await knex('bots').where('id', 1).first();
        if (!existingBot) {
            await knex('bots').insert({
                id: 1,
                name: 'Default Bot',
                token: 'default_token',
                created_at: new Date()
            });
            console.log('Created default bot with ID=1');
        }

        // Добавляем колонку bot_id
        await knex.schema.alterTable('users', (table) => {
            table.integer('bot_id').defaultTo(1);
        });

        // Обновляем все существующие записи
        await knex('users').whereNull('bot_id').update({ bot_id: 1 });

        // Делаем колонку NOT NULL
        await knex.schema.alterTable('users', (table) => {
            table.integer('bot_id').notNullable().alter();
        });

        // Добавляем внешний ключ
        await knex.schema.alterTable('users', (table) => {
            table.foreign('bot_id').references('id').inTable('bots').onDelete('CASCADE');
        });

        // Удаляем старый уникальный индекс
        await knex.raw('DROP INDEX IF EXISTS users_telegram_id_unique');
        
        // Создаем новый уникальный индекс
        await knex.raw('CREATE UNIQUE INDEX users_telegram_bot_unique ON users(telegram_id, bot_id)');
        
        console.log('Successfully added bot_id column and constraints');
    } else {
        console.log('bot_id column already exists, skipping migration');
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    // Удаляем внешний ключ
    await knex.schema.alterTable('users', (table) => {
        table.dropForeign(['bot_id']);
    });

    // Удаляем колонку bot_id
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('bot_id');
    });

    // Восстанавливаем старый уникальный индекс
    await knex.raw('DROP INDEX IF EXISTS users_telegram_bot_unique');
    await knex.raw('CREATE UNIQUE INDEX users_telegram_id_unique ON users(telegram_id)');

    // Удаляем дефолтного бота
    await knex('bots').where('id', 1).where('name', 'Default Bot').del();
}; 