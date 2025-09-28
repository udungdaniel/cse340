const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    try {
        return await pool.query(
            "SELECT * FROM public.classification ORDER BY classification_name"
        )
    } catch (error) {
        console.error("getClassifications error:", error)
        throw error
    }
}

/* ***************************
 *  Get vehicles by classification ID
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const sql = `
      SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
    `
        return (await pool.query(sql, [classification_id])).rows
    } catch (error) {
        console.error("getInventoryByClassificationId error:", error)
        throw error
    }
}

/* ***************************
 *  Get vehicle by ID
 * ************************** */
async function getVehicleById(inv_id) {
    try {
        const sql = "SELECT * FROM public.inventory WHERE inv_id = $1"
        return (await pool.query(sql, [inv_id])).rows[0]
    } catch (error) {
        console.error("getVehicleById error:", error)
        throw error
    }
}

/* ***************************
 *  Get all inventory
 * ************************** */
async function getAllInventory() {
    try {
        const sql = "SELECT * FROM public.inventory ORDER BY inv_make, inv_model"
        return (await pool.query(sql)).rows
    } catch (error) {
        console.error("getAllInventory error:", error)
        throw error
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById,
    getAllInventory,
}
