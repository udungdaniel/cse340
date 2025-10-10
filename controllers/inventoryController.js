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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Inventory Management",
      message: req.flash("message") || null,
      nav,
      classificationSelect,
      errors: null,
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
 * ************************** */
invController.addVehicleView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const classificationList = await invModel.getClassifications()
    res.render("inventory/add-vehicle", {
      errors: null,
      message: null,
      classificationList,
      classification_id: null,
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

    if (!classification_id) errors.push({ msg: "Classification is required." })
    if (!inv_make || !inv_model) errors.push({ msg: "Make and Model are required." })
    if (!inv_year || inv_year < 1900 || inv_year > 2099) errors.push({ msg: "Year is invalid." })
    if (!inv_price || inv_price <= 0) errors.push({ msg: "Price must be positive." })
    if (!inv_description) errors.push({ msg: "Description is required." })

    if (errors.length > 0) {
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
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    return res.json(invData || [])
  } catch (error) {
    console.error("getInventoryJSON error:", error)
    res.status(500).json({ error: "Server error while fetching inventory data" })
  }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invController.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    console.log("Edit request for vehicle ID:", inv_id)

    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)

    if (!itemData) {
      req.flash("message", "Vehicle not found.")
      return res.redirect("/inv/")
    }

    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  } catch (error) {
    console.error("editInventoryView error:", error)
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body

  try {
    const updateResult = await invModel.updateInventory(
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
    )

    if (updateResult) {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
    }
  } catch (error) {
    console.error("updateInventory error:", error)
    next(error)
  }
}

/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
invController.buildDeleteInventoryView = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)

    if (!itemData) {
      req.flash("notice", "Sorry, the requested vehicle was not found.")
      return res.redirect("/inv/")
    }

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    })
  } catch (error) {
    console.error("Error building delete view:", error)
    next(error)
  }
}

/* ***************************
 *  Process Delete Inventory Item
 * ************************** */
invController.deleteInventoryItem = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.body.inv_id, 10)

    if (Number.isNaN(inv_id)) {
      req.flash("notice", "Invalid inventory id.")
      return res.redirect("/inv/")
    }

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
      req.flash("success", "Vehicle successfully deleted.")
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed. Please try again.")
      return res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    console.error("Error processing delete:", error)
    next(error)
  }
}

module.exports = invController
