const pool = require("../database/")

/* ***************************
 *  Get all inventory by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory WHERE classification_id = $1",
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId error:", error)
    }
}

/* ***************************
 *  Get vehicle by inventory id
 * ************************** */
async function getVehicleById(inv_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory WHERE inv_id = $1",
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getVehicleById error:", error)
    }
}

/* ***************************
 *  Get all inventory
 * ************************** */
async function getAllInventory() {
    try {
        const data = await pool.query("SELECT * FROM public.inventory ORDER BY inv_make")
        return data.rows
    } catch (error) {
        console.error("getAllInventory error:", error)
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function insertClassification(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        const data = await pool.query(sql, [classification_name])
        return data.rows[0]
    } catch (error) {
        console.error("insertClassification error:", error)
    }
}

/* ***************************
 *  Add new vehicle
 * ************************** */
async function insertVehicle(vehicleData) {
    try {
        const sql = `
      INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_price, inv_description, inv_image, inv_thumbnail)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`
        const data = await pool.query(sql, [
            vehicleData.classification_id,
            vehicleData.inv_make,
            vehicleData.inv_model,
            vehicleData.inv_year,
            vehicleData.inv_price,
            vehicleData.inv_description,
            vehicleData.inv_image,
            vehicleData.inv_thumbnail,
        ])
        return data.rows[0]
    } catch (error) {
        console.error("insertVehicle error:", error)
    }
}

/* ***************************
 *  Get classifications
 * ************************** */
async function getClassifications() {
    try {
        const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
        return data.rows
    } catch (error) {
        console.error("getClassifications error:", error)
    }
}

/* ***************************
 *  Get inventory item by ID (for edit)
 * ************************** */
async function getInventoryById(inv_id) {
    try {
        const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("getInventoryById error:", error)
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql = `
      UPDATE public.inventory 
      SET inv_make = $1,
          inv_model = $2,
          inv_description = $3,
          inv_image = $4,
          inv_thumbnail = $5,
          inv_price = $6,
          inv_year = $7,
          inv_miles = $8,
          inv_color = $9,
          classification_id = $10
      WHERE inv_id = $11
      RETURNING *`
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id,
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 *  Module Exports
 * ************************** */
module.exports = {
    getInventoryByClassificationId,
    getVehicleById,
    getAllInventory,
    insertClassification,
    insertVehicle,
    getClassifications,
    getInventoryById,
    updateInventory,
}
