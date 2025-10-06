const pool = require('../database/') // PostgreSQL connection pool

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
    try {
        const sql = "SELECT * FROM public.classification ORDER BY classification_name"
        const data = await pool.query(sql)
        return data.rows
    } catch (error) {
        console.error("getClassifications error:", error)
        throw error
    }
}

/* ***************************
 *  Insert a new classification
 * ************************** */
async function insertClassification(classification_name) {
    try {
        const sql = `INSERT INTO public.classification (classification_name)
                 VALUES ($1)
                 RETURNING classification_id;`
        const values = [classification_name]
        const result = await pool.query(sql, values)
        // Return inserted id or null
        return result.rowCount > 0 ? result.rows[0].classification_id : null
    } catch (error) {
        console.error("insertClassification error:", error)
        throw error
    }
}

/* ***************************
 *  Insert a new vehicle into inventory
 * ************************** */
async function insertVehicle(vehicleData) {
    try {
        const {
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_image,
            inv_thumbnail
        } = vehicleData

        const sql = `INSERT INTO public.inventory
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_image, inv_thumbnail)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING inv_id;`

        const values = [
            parseInt(classification_id, 10),
            inv_make,
            inv_model,
            parseInt(inv_year, 10),
            inv_description,
            parseFloat(inv_price),
            inv_image,
            inv_thumbnail
        ]

        const result = await pool.query(sql, values)
        return result.rowCount > 0 ? result.rows[0].inv_id : null
    } catch (error) {
        console.error("insertVehicle error:", error)
        throw error
    }
}

/* ***************************
 *  Get all vehicles (for management or listing)
 * ************************** */
async function getAllInventory() {
    try {
        const sql = `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_thumbnail, c.classification_name
                 FROM public.inventory i
                 JOIN public.classification c ON i.classification_id = c.classification_id
                 ORDER BY inv_make, inv_model`
        const data = await pool.query(sql)
        return data.rows
    } catch (error) {
        console.error("getAllInventory error:", error)
        throw error
    }
}

/* ***************************
 *  Get vehicles by classification ID
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const sql = `SELECT * FROM public.inventory WHERE classification_id = $1 ORDER BY inv_make, inv_model`
        const data = await pool.query(sql, [classification_id])
        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId error:", error)
        throw error
    }
}

/* ***************************
 *  Get single vehicle by ID
 * ************************** */
async function getVehicleById(inv_id) {
    try {
        const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`
        const data = await pool.query(sql, [inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("getVehicleById error:", error)
        throw error
    }
}

module.exports = {
    getClassifications,
    insertClassification,
    insertVehicle,
    getAllInventory,
    getInventoryByClassificationId,
    getVehicleById
}
