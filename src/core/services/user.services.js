  const { pool } = require('../database/database');

  const MAX_LENGTH = 50;

  class UserService {
    // ✅ Логин
    async getlogIn(login, password) {
      if (!login || !password) throw new Error('Поля не могут быть пустыми');
      if (login.length > MAX_LENGTH || password.length > MAX_LENGTH)
        throw new Error('Логин или пароль слишком длинные');

      const result = await pool.query(
        `SELECT id, password, role FROM users WHERE login = $1 LIMIT 1`,
        [login]
      );

      const user = result.rows[0];
      if (!user || user.password !== password)
        throw new Error('Неверный логин или пароль');

      return { id: user.id, role: user.role };
    }

    // ✅ Регистрация
    async createUser(login, password, fullName = 'user') {
      if (!login || !password) throw new Error('Поля не могут быть пустыми');
      if (login.length > MAX_LENGTH || password.length > MAX_LENGTH || fullName.length > MAX_LENGTH)
        throw new Error('Логин, пароль или полное имя слишком длинные');
    
      try {
        const result = await pool.query(
          `INSERT INTO users (login, password, full_name, role) VALUES ($1, $2, $3, 'user') RETURNING id`,
          [login, password, fullName]
        );
          return { success: true, message: 'Пользователь был успешно зарегистрирован!' };      } catch (err) {
        if (err.code === '23505') throw new Error('Логин уже занят');
        throw err;
      }
    }

    async getUserBalance(userId) {
      const result = await pool.query(
        `SELECT balance FROM users WHERE id = $1`,
        [userId]
      );
      if (result.rowCount === 0) throw new Error('Пользователь не найден');
      return result.rows[0].balance;
    }

    async changeUserBalance(userId, amount) {
      const result = await pool.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *`,
        [amount, userId]
      );
      if (result.rowCount === 0) throw new Error('Пользователь не найден');
      return result.rows[0];
    }

    // ➕ Добавить услугу пользователю
    async addUtilityToUser(userId, utilityId) {
    // Получаем тип подключаемой услуги
    const utilityResult = await pool.query(
      'SELECT name FROM utilities WHERE id = $1 LIMIT 1',
      [utilityId]
    );

    if (utilityResult.rowCount === 0) {
      throw new Error('Услуга не найдена');
    }

    const targetUtilityName = utilityResult.rows[0].name;

    // Проверяем, подписан ли пользователь уже на эту конкретную услугу
    const existingExact = await pool.query(
      `SELECT * FROM user_utilities 
      WHERE user_id = $1 AND utility_id = $2`,
      [userId, utilityId]
    );

    if (existingExact.rowCount > 0) {
      throw new Error('Пользователь уже подключён к этой услуге');
    }

    // Проверяем, есть ли у пользователя другая услуга такого же типа (по имени)
    const conflicting = await pool.query(
      `SELECT uu.* FROM user_utilities uu
        JOIN utilities u ON uu.utility_id = u.id
        WHERE uu.user_id = $1 AND u.name = $2`,
      [userId, targetUtilityName]
    );

    if (conflicting.rowCount > 0) {
      throw new Error(`У пользователя уже подключена услуга типа "${targetUtilityName}"`);
    }

    // Всё чисто, можно подписывать
    const result = await pool.query(
      `INSERT INTO user_utilities (user_id, utility_id, debt, meter_value)
      VALUES ($1, $2,$3,$4) RETURNING *`,
      [userId, utilityId, 0,0]
    );

    return result.rows[0];
  }

    // ❌ Удалить услугу пользователя (если оплачено)
    async removeUserUtility(userId, utilityId) {
      // Проверяем, есть ли долг у пользователя
      const debtResult = await pool.query(
        `SELECT debt FROM user_utilities WHERE user_id = $1 AND utility_id = $2 LIMIT 1`,
        [userId, utilityId]
      );
    
      if (debtResult.rowCount === 0) {
        throw new Error('Услуга не найдена для данного пользователя');
      }
    
      const debt = debtResult.rows[0].debt;
    
      // Если долг больше 0, то не можем удалить услугу
      if (debt > 0) {
        throw new Error('У пользователя есть задолженность по услуге, удаление невозможно');
      }
    
      // Если долг 0, удаляем услугу
      const res = await pool.query(
        `DELETE FROM user_utilities 
        WHERE user_id = $1 AND utility_id = $2 AND debt = 0
        RETURNING *`,
        [userId, utilityId]
      );
    
      if (res.rowCount === 0) {
        throw new Error('Не удалось удалить услугу');
      }
    
      return true; // Услуга успешно удалена
    }
    

    // 🧮 Посчитать оплату по счётчикам
    async calculateTotal(userId,utilityId) {
      
      const result = await pool.query(
        `SELECT uu.meter_value, u.price_per_unit
        FROM user_utilities uu
        JOIN utilities u ON u.id = uu.utility_id
        WHERE uu.user_id = $1`,
        [userId]
      );

      return result.rows.reduce((sum, item) => {
        return sum + item.meter_value * item.price_per_unit;
      }, 0);
    }

    // 🏢 Получить компании, на которые не подписан пользователь
    async getUnsubscribedCompanies(userId) {
      const result = await pool.query(
        `SELECT DISTINCT u.company
        FROM utilities u
        WHERE u.company NOT IN (
          SELECT u.company
          FROM user_utilities uu
          JOIN utilities u ON uu.utility_id = u.id
          WHERE uu.user_id = $1
        )`,
        [userId]
      );
      return result.rows.map(row => row.company);
    }

    // ✉️ Отправить сообщение
    async sendNotification(userId, message) {
      if (!message || message.length > 255) throw new Error('Сообщение пустое или слишком длинное');

      const result = await pool.query(
        `INSERT INTO notifications (user_id, message)
        VALUES ($1, $2) RETURNING *`,
        [userId, message]
      );

      return result.rows[0];
    }

    async getUtilityForUser(userId) {
      //TODO
      const result = await pool.query(
        `SELECT u.id, u.name, uu.meter_value, uu.debt
        FROM user_utilities uu
        JOIN utilities u ON uu.utility_id = u.id
        WHERE uu.user_id = $1`,
        [userId]
      );

      return result.rows;
    }
    // 🧾 Получить всех пользователей и их услуги
    async getAllUsersWithUtilities() {
      const result = await pool.query(
        `SELECT 
          u.id AS user_id,
          u.login,
          ut.name AS utility,
          uu.meter_value,
          CASE 
            WHEN uu.meter_value * ut.price_per_unit - uu.last_payment > 0 THEN false
            ELSE true
          END AS is_paid
        FROM users u
        LEFT JOIN user_utilities uu ON u.id = uu.user_id
        LEFT JOIN utilities ut ON ut.id = uu.utility_id`
      );

      return result.rows;
    }
  }

  module.exports = UserService;
