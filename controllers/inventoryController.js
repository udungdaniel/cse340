const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const invController = {}

/* ***************************
 *  Build inventory by classification
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()
    const grid = await utilities.buildClassificationGrid(data)
    const className = data.length > 0 ? data[0].classification_name : ""
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by vehicle id
 * ************************** */
invController.buildByInvId = async function (req, res, next) {
    const invId = req.params.invId
    const data = await invModel.getVehicleById(invId)
    const nav = await utilities.getNav()
    const detail = await utilities.buildVehicleDetail(data)
    res.render("./inventory/detail", {
        title: `${data.inv_make} ${data.inv_model}`,
        nav,
        detail,
    })
}

/* ***************************
 *  Build full inventory listing (/inv)
 * ************************** */
invController.buildInventory = async function (req, res, next) {
    const data = await invModel.getAllInventory()
    const nav = await utilities.getNav()
    const grid = await utilities.buildClassificationGrid(data)
    res.render("inventory/classification", {
        title: "All Vehicles",
        nav,
        grid,
    })
}

module.exports = invController
