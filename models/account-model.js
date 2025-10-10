const pool = require("../database/")

/* Register New Account */
async function registerAccount(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *`
    const result = await pool.query(sql, [firstname, lastname, email, password])
    return result.rows[0]
  } catch (error) {
    console.error("Register Account Error:", error.message)
    return null
  }
}

/* Get Account by Email */
async function getAccountByEmail(email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type
      FROM account
      WHERE account_email = $1`
    const result = await pool.query(sql, [email])
    return result.rows[0]
  } catch (error) {
    console.error("Get Account by Email Error:", error.message)
    return null
  }
}

/* Get Account by ID */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type
      FROM account
      WHERE account_id = $1`
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("Get Account by ID Error:", error.message)
    return null
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById
}
