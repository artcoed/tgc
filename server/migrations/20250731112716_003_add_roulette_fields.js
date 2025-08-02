/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 1000.00,
        ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'EUR',
        ADD COLUMN IF NOT EXISTS roulette_daily_attempts INTEGER DEFAULT 5,
        ADD COLUMN IF NOT EXISTS roulette_last_reset_date DATE DEFAULT CURRENT_DATE,
        ADD COLUMN IF NOT EXISTS roulette_total_wins INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS roulette_total_losses INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS roulette_total_winnings DECIMAL(10,2) DEFAULT 0.00;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        ALTER TABLE users 
        DROP COLUMN IF EXISTS balance,
        DROP COLUMN IF EXISTS currency,
        DROP COLUMN IF EXISTS roulette_daily_attempts,
        DROP COLUMN IF EXISTS roulette_last_reset_date,
        DROP COLUMN IF EXISTS roulette_total_wins,
        DROP COLUMN IF EXISTS roulette_total_losses,
        DROP COLUMN IF EXISTS roulette_total_winnings;
    `);
}; 