const { pool } = require('./database'); // Подключаем pool из твоего database.js

const calculatePrice = async (counterIndicator, serviceType)=>{
  try {
    const result = await pool.query(
      `INSERT INTO users (login, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id`,
      [fullName, login, password, role]
    );

    return { id: result.rows[0].id };
  } catch (err) {
    console.error('Register error:', err);
    throw err;
  }
}

module.exports = { login, register };
