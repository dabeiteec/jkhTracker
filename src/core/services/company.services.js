const { pool } = require('../core/database/database');

async function sendNotification(userId, message) {
    const res = await pool.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, message]
    );
    return res.rows[0];
  }


async function getAllUsersWithUtilities() {
  const query = `
    SELECT 
      u.id AS user_id,
      u.full_name,
      ut.name AS utility_name,
      c.name AS company_name,
      uu.meter_value,
      uu.last_payment,
      ROUND((uu.meter_value * ut.price_per_unit)::numeric, 2) AS current_due,
      CASE 
        WHEN uu.last_payment >= (uu.meter_value * ut.price_per_unit) THEN true
        ELSE false
      END AS is_paid
    FROM users u
    JOIN user_utilities uu ON u.id = uu.user_id
    JOIN utilities ut ON uu.utility_id = ut.id
    JOIN companies c ON ut.company_id = c.id
    WHERE u.role = 'user'
    ORDER BY u.id;
  `;

  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (err) {
    console.error('Error getting users with utilities:', err);
    throw err;
  }
}

module.exports = { getAllUsersWithUtilities };
