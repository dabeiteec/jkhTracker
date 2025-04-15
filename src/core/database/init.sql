CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name TEXT,
  login TEXT UNIQUE,
  password TEXT,
  role TEXT,
  balance NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS utilities (
  id SERIAL PRIMARY KEY,
  name TEXT,
  price_per_unit NUMERIC,
  company TEXT
);

CREATE TABLE IF NOT EXISTS user_utilities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  utility_id INTEGER REFERENCES utilities(id),
  meter_value NUMERIC DEFAULT 0,
  last_payment NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
