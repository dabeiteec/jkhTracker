const { pool } = require('../database/database');

class UtilityService {
  // Получить все утилиты
  async getAllUtilities() {
    try {
      const res = await pool.query('SELECT * FROM utilities');
      return res.rows;
    } catch (err) {
      console.error('Ошибка при получении утилит:', err);
      throw err;
    }
  }
  async getUserUtilities(userId) {
    //TODO
  }

  // Добавить утилиту
  async addUtility(name, pricePerUnit, company) {
    try {
      const query = 'INSERT INTO utilities (name, price_per_unit, company) VALUES ($1, $2, $3) RETURNING *';
      const values = [name, pricePerUnit, company];
      const res = await pool.query(query, values);
      return res.rows[0]; // Возвращаем добавленную утилиту
    } catch (err) {
      console.error('Ошибка при добавлении утилиты:', err);
      throw err;
    }
  }

  // Удалить утилиту по ID
  async deleteUtility(id) {
    try {
      const query = 'DELETE FROM utilities WHERE id = $1 RETURNING *';
      const values = [id];
      const res = await pool.query(query, values);
      return res.rows[0]; // Возвращаем удаленную утилиту (если нужно)
    } catch (err) {
      console.error('Ошибка при удалении утилиты:', err);
      throw err;
    }
  }

  // Отправить уведомление
  async sendNotification(userId, message) {
    try {
      const res = await pool.query(
        `INSERT INTO notifications (user_id, message) 
        VALUES ($1, $2) 
        RETURNING *`,
        [userId, message]
      );
      return res.rows[0]; // Возвращаем созданное уведомление
    } catch (err) {
      console.error('Ошибка при отправке уведомления:', err);
      throw err;
    }
  }
}

// Экспортируем класс для использования в других частях приложения
module.exports = UtilityService;
