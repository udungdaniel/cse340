const pool = require("../database/")

/* ***************************
 *  Register New Account
 * *************************** */
async function registerAccount(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type`

    const result = await pool.query(sql, [firstname, lastname, email, password])
    return result.rows[0]
  } catch (error) {
    console.error("❌ Register Account Error:", error)
    throw new Error("Registration failed. Please check your input or database setup.")
  }
}

/* ***************************
 *  Get Account by Email
 * *************************** */
async function getAccountByEmail(email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type
      FROM public.account
      WHERE account_email = $1`
    const result = await pool.query(sql, [email])
    return result.rows[0]
  } catch (error) {
    console.error("❌ Get Account by Email Error:", error)
    throw new Error("Unable to get account by email.")
  }
}

/* ***************************
 *  Get Account by ID
 * *************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, phone, address
      FROM public.account
      WHERE account_id = $1`
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("❌ Get Account by ID Error:", error)
    throw new Error("Unable to get account by ID.")
  }
}

/* ***************************
 *  Update Account Profile
 * *************************** */
async function updateAccount(account_id, firstname, email, phone, address) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $2, account_email = $3, phone = $4, address = $5
      WHERE account_id = $1
      RETURNING *`
    const result = await pool.query(sql, [account_id, firstname, email, phone, address])
    return result.rowCount > 0
  } catch (error) {
    console.error("❌ Update Account Error:", error)
    throw new Error("Unable to update account.")
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
}
