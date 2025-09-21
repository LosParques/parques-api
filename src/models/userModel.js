const pool = require('../config/dbConfig');

const createUser = async ({ email, username, passwordHash, cellphone_number, group_role }) => {
  const query = `
    INSERT INTO users (email, username, password_hash, cellphone_number, group_role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, email, username, cellphone_number, group_role;
  `;
  const values = [email, username, passwordHash, cellphone_number, group_role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByUsername,
};
