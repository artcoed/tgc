"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const env_1 = require("../env");
exports.db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({
        pool: new pg_1.Pool({
            connectionString: env_1.env.DATABASE_URL,
        }),
    }),
});
