import { db } from '../index';
import type { Insertable, Selectable } from 'kysely';
import type { Database } from '../types';

type BotTable = Database['bots'];
type Bot = Selectable<BotTable>;
type NewBot = Insertable<BotTable>; // Now { id?: number; name: string; token: string; created_at?: Date }

export class BotRepository {
    async getAll(): Promise<Bot[]> {
        return db.selectFrom('bots').selectAll().execute();
    }

    async getById(id: number): Promise<Bot | undefined> {
        return db.selectFrom('bots').selectAll().where('id', '=', id).executeTakeFirst();
    }

    async getByToken(token: string): Promise<Bot | undefined> {
        return db.selectFrom('bots').selectAll().where('token', '=', token).executeTakeFirst();
    }

    async add(bot: NewBot): Promise<Bot> {
        return db
            .insertInto('bots')
            .values(bot)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    async remove(id: number): Promise<void> {
        await db.deleteFrom('bots').where('id', '=', id).execute();
    }
}