const pool = require("../database/")

async function getProfileById(account_id) {
  try {
    const result = await pool.query("SELECT * FROM public.account WHERE account_id = $1", [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("getProfileById error: " + error)
  }
}

async function updateProfile(account_id, name, email, phone, address) {
  try {
    const sql = `UPDATE public.account 
                 SET account_firstname = $1, account_email = $2, phone = $3, address = $4
                 WHERE account_id = $5
                 RETURNING *`
    const data = await pool.query(sql, [name, email, phone, address, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateProfile error: " + error)
  }
}

module.exports = { getProfileById, updateProfile }
