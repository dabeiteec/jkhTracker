require('dotenv').config();
const { Pool } = require('pg');

// Настройки подключения к PostgreSQL
const pool = new Pool({
  user:process.env.DB_USER,
  database:process.env.DB_NAME,
  password:process.env.DB_PASSWORD,
  host:process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};