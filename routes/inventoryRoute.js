const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities")

// Management View - /inv/
router.get("/", utilities.handleErrors(inventoryController.buildManagementView))

// Add Classification View - /inv/add-classification
router.get("/add-classification", utilities.handleErrors(inventoryController.addClassificationView))

// Process Add Classification - /inv/add-classification
router.post("/add-classification", utilities.handleErrors(inventoryController.addClassification))

// Add Vehicle View - /inv/add-vehicle
router.get("/add-vehicle", utilities.handleErrors(inventoryController.addVehicleView))

// Process Add Vehicle - /inv/add-vehicle
router.post("/add-vehicle", utilities.handleErrors(inventoryController.addVehicle))

// View vehicles by classification - /inv/type/:classificationId
router.get("/type/:classificationId", utilities.handleErrors(inventoryController.buildByClassificationId))

// View vehicle details - /inv/detail/:vehicleId
router.get("/detail/:vehicleId", utilities.handleErrors(inventoryController.buildByVehicleId))

module.exports = router
