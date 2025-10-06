const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const invController = {}

/* ***************************
 *  Build inventory by classification
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()
    const grid = await utilities.buildClassificationGrid(data)
    const className = data.length > 0 ? data[0].classification_name : ""
    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build inventory by vehicle id
 * ************************** */
invController.buildByInvId = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const data = await invModel.getVehicleById(invId)
    const nav = await utilities.getNav()
    const vehicleDetail = await utilities.buildVehicleDetail(data)
    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      vehicleDetail,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build full inventory listing (/inv)
 * ************************** */
invController.buildInventory = async function (req, res, next) {
  try {
    const data = await invModel.getAllInventory()
    const nav = await utilities.getNav()
    const grid = await utilities.buildClassificationGrid(data)
    res.render("inventory/classification", {
      title: "All Vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Management View
 * ************************** */
invController.buildManagementView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      message: req.flash("message") || null,
      nav,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add Classification View
 * ************************** */
invController.addClassificationView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors: null,
      message: null,
      classification_name: null,
      nav,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invController.addClassification = async (req, res, next) => {
  const { classification_name } = req.body

  try {
    const nav = await utilities.getNav()
    if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
      return res.render("inventory/add-classification", {
        errors: [{ msg: "Classification name cannot contain spaces or special characters" }],
        message: null,
        classification_name,
        nav,
      })
    }

    const result = await invModel.insertClassification(classification_name)

    if (result) {
      req.flash("message", `Classification "${classification_name}" added successfully.`)
      return res.redirect("/inv/")
    } else {
      res.render("inventory/add-classification", {
        errors: [{ msg: "Failed to add classification." }],
        message: null,
        classification_name,
        nav,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add Vehicle View
 *  (now passes classificationList as an ARRAY)
 * ************************** */
invController.addVehicleView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    // getClassifications returns an array (model function)
    const classificationList = await invModel.getClassifications()
    res.render("inventory/add-vehicle", {
      errors: null,
      message: null,
      classificationList,        // array used by EJS forEach
      classification_id: null,   // no selection yet
      inv_make: null,
      inv_model: null,
      inv_year: null,
      inv_price: null,
      inv_description: null,
      inv_image: "/images/no-image.png",
      inv_thumbnail: "/images/no-image.png",
      nav,
    })
  } catch (error) {
    console.error("Error in addVehicleView:", error)
    next(error)
  }
}

/* ***************************
 *  Process Add Vehicle
 * ************************** */
invController.addVehicle = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_image,
    inv_thumbnail,
  } = req.body

  try {
    const nav = await utilities.getNav()
    const errors = []

    // Server-side validation
    if (!classification_id) errors.push({ msg: "Classification is required." })
    if (!inv_make || !inv_model) errors.push({ msg: "Make and Model are required." })
    if (!inv_year || inv_year < 1900 || inv_year > 2099) errors.push({ msg: "Year is invalid." })
    if (!inv_price || inv_price <= 0) errors.push({ msg: "Price must be positive." })
    if (!inv_description) errors.push({ msg: "Description is required." })

    if (errors.length > 0) {
      // pass classifications as array and the previously selected classification_id for stickiness
      const classificationList = await invModel.getClassifications()
      return res.render("inventory/add-vehicle", {
        errors,
        message: null,
        classificationList,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        inv_description,
        inv_image,
        inv_thumbnail,
        nav,
      })
    }

    // build the vehicleData with proper types
    const vehicleData = {
      classification_id: parseInt(classification_id, 10),
      inv_make: inv_make.trim(),
      inv_model: inv_model.trim(),
      inv_year: parseInt(inv_year, 10),
      inv_description: inv_description.trim(),
      inv_price: parseFloat(inv_price),
      inv_image: inv_image.trim(),
      inv_thumbnail: inv_thumbnail.trim(),
    }

    const result = await invModel.insertVehicle(vehicleData)

    if (result) {
      req.flash("message", `Vehicle "${inv_make} ${inv_model}" added successfully.`)
      res.redirect("/inv/")
    } else {
      const classificationList = await invModel.getClassifications()
      res.render("inventory/add-vehicle", {
        errors: [{ msg: "Failed to add vehicle." }],
        message: null,
        classificationList,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        inv_description,
        inv_image,
        inv_thumbnail,
        nav,
      })
    }
  } catch (error) {
    console.error("Error in addVehicle:", error)
    next(error)
  }
}

/* ***************************
 *  Export all functions
 * ************************** */
module.exports = invController
