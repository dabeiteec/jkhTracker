const { pool } = require('./database'); // Подключаем pool из твоего database.js


const login = async (login, password)=>{
  try {
    const result = await pool.query(
      `SELECT id, role FROM users WHERE login = $1 AND password = $2`,
      [login, password]
    );

    if (result.rows.length > 0) {
      return result.rows[0]; 
    } else {
      return null; 
    }
  } catch (err) {
    console.error('Login error:', err.message('Ошибка базы данных'));
    throw err;
  }
}


const register = async (login, password)=>{
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
