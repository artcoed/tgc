/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // Сначала создаем запись в таблице bots, если её нет
    const existingBot = await knex('bots').where('id', 1).first();
    if (!existingBot) {
        await knex('bots').insert({
            id: 1,
            name: 'Default Bot',
            token: 'default_token',
            created_at: new Date()
        });
    }

    // Добавляем колонку bot_id без DEFAULT значения
    await knex.raw(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS bot_id INTEGER;
    `);

    // Обновляем существующие записи, устанавливая bot_id = 1
    await knex.raw(`
        UPDATE users SET bot_id = 1 WHERE bot_id IS NULL;
    `);

    // Делаем колонку NOT NULL
    await knex.raw(`
        ALTER TABLE users 
        ALTER COLUMN bot_id SET NOT NULL;
    `);

    // Добавляем внешний ключ
    await knex.raw(`
        ALTER TABLE users 
        ADD CONSTRAINT fk_users_bot_id FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE;
    `);
    
    // Создаем уникальный индекс для telegram_id + bot_id
    await knex.raw(`
        DROP INDEX IF EXISTS users_telegram_id_unique;
        CREATE UNIQUE INDEX users_telegram_bot_unique ON users(telegram_id, bot_id);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    // Удаляем внешний ключ
    await knex.raw(`
        ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_bot_id;
    `);

    // Удаляем колонку bot_id
    await knex.raw(`
        ALTER TABLE users DROP COLUMN IF EXISTS bot_id;
    `);

    // Восстанавливаем уникальный индекс по telegram_id
    await knex.raw(`
        DROP INDEX IF EXISTS users_telegram_bot_unique;
        CREATE UNIQUE INDEX users_telegram_id_unique ON users(telegram_id);
    `);

    // Удаляем дефолтного бота, если он был создан этой миграцией
    await knex('bots').where('id', 1).where('name', 'Default Bot').del();
}; 