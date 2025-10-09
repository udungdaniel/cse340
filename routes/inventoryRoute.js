const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities")

// Management View - /inv/
router.get("/", utilities.handleErrors(inventoryController.buildManagementView))

// Add Classification View - /inv/add-classification
router.get(
    "/add-classification",
    utilities.handleErrors(inventoryController.addClassificationView)
)

// Add Vehicle View - /inv/add-vehicle
router.get(
    "/add-vehicle",
    utilities.handleErrors(inventoryController.addInventoryView)
)

// Process Adding a New Classification
router.post(
    "/add-classification",
    utilities.handleErrors(inventoryController.addClassification)
)

// Process Adding a New Vehicle
router.post(
    "/add-vehicle",
    utilities.handleErrors(inventoryController.addInventory)
)

// Get Inventory JSON by Classification ID
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(inventoryController.getInventoryJSON)
)

// Edit Vehicle View
router.get(
    "/edit/:inv_id",
    utilities.handleErrors(inventoryController.editInventoryView)
)

// Process Updating Vehicle Information
router.post(
    "/update",
    utilities.handleErrors(inventoryController.updateInventory)
)

module.exports = router
