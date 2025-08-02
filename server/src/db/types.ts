import { Generated } from 'kysely';

export interface Database {
    bots: {
        id: Generated<number>;
        name: string;
        token: string;
        created_at: Generated<Date>;
    };
    users: {
        id: Generated<number>;
        telegram_id: number;
        bot_id: number;
        first_name: string | null;
        last_name: string | null;
        username: string | null;
        language_code: string | null;
        is_premium: boolean;
        allows_write_to_pm: boolean;
        full_name: string | null;
        age: number | null;
        city: string | null;
        phone: string | null;
        iban: string | null;
        balance: number;
        currency: string;
        roulette_daily_attempts: number;
        roulette_last_reset_date: Date;
        roulette_total_wins: number;
        roulette_total_losses: number;
        roulette_total_winnings: number;
        created_at: Generated<Date>;
        updated_at: Generated<Date>;
    };
}