require('dotenv').config();
const { Pool } = require('pg');

async function createDatabaseIfNotExists(dbName) {
  const systemPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // подключаемся к системной БД
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  try {
    const result = await systemPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount === 0) {
      await systemPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`📦 База данных "${dbName}" создана.`);
    } else {
      console.log(`📦 База данных "${dbName}" уже существует.`);
    }
  } catch (err) {
    console.error('❌ Ошибка при создании БД:', err);
    throw err;
  } finally {
    await systemPool.end();
  }
}

module.exports = { createDatabaseIfNotExists };
