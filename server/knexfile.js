module.exports = {
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: "db",
    user: "postgres",
    password: "postgres",
    database: "tgcoinbackend",
  },
  migrations: {
    directory: "./migrations", // Папка для миграций
    tableName: "knex_migrations", // Таблица для отслеживания миграций
  },
};