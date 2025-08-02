const { RouletteService } = require('./dist/services/RouletteService');
const { UserRepository } = require('./dist/db/repositories/UserRepository');

async function testRoulette() {
    const rouletteService = new RouletteService();
    const userRepo = new UserRepository();
    const { db } = require('./dist/db/index');

    // Создаем тестового бота, если его нет
    const existingBot = await db.selectFrom('bots').where('id', '=', 1).executeTakeFirst();
    if (!existingBot) {
        await db.insertInto('bots').values({
            id: 1,
            name: 'Test Bot',
            token: 'test_token',
            created_at: new Date()
        }).execute();
        console.log('Test bot created');
    }

    // Создаем тестового пользователя
    const testUser = await userRepo.create({
        telegram_id: 123456789,
        bot_id: 1, // ID тестового бота
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'en',
        is_premium: false,
        allows_write_to_pm: true,
        full_name: 'Test User',
        age: 25,
        city: 'Test City',
        phone: '+1234567890',
        iban: 'TEST123456789',
        balance: 1000.00,
        currency: 'EUR',
        roulette_daily_attempts: 5,
        roulette_last_reset_date: new Date(),
        roulette_total_wins: 0,
        roulette_total_losses: 0,
        roulette_total_winnings: 0.00,
    });

    console.log('Test user created:', testUser);

    // Получаем информацию о рулетке
    const rouletteInfo = await rouletteService.getUserRouletteInfo(testUser.telegram_id, testUser.bot_id);
    console.log('Roulette info:', rouletteInfo);

    // Делаем ставку
    try {
        const betResult = await rouletteService.placeBet(testUser.telegram_id, testUser.bot_id, 100, 'red');
        console.log('Bet result:', betResult);
    } catch (error) {
        console.error('Bet error:', error.message);
    }

    // Получаем обновленную информацию
    const updatedInfo = await rouletteService.getUserRouletteInfo(testUser.telegram_id, testUser.bot_id);
    console.log('Updated roulette info:', updatedInfo);
}

testRoulette().catch(console.error); 