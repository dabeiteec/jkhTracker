const fs = require('fs');
const path = require('path');
const db = require('./database');

async function initializeDatabase() {
  const sqlPath = path.join(__dirname, 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  try {
    await db.pool.query(sql);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Failed to initialize DB:', err);
  }
}

module.exports = { initializeDatabase };
