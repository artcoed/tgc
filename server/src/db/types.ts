import { Generated } from 'kysely';

export interface Database {
    bots: {
        id: Generated<number>;
        name: string;
        token: string;
        created_at: Generated<Date>;
    };
}