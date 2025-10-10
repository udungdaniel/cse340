const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const checkEmployee = require("../middleware/checkEmployee"); // Middleware to restrict access

// Management View - /inv/ (protected)
router.get("/", checkEmployee, utilities.handleErrors(inventoryController.buildManagementView));

// Add Classification View - /inv/add-classification (protected)
router.get(
  "/add-classification",
  checkEmployee,
  utilities.handleErrors(inventoryController.addClassificationView)
);

// Add Vehicle View - /inv/add-vehicle (protected)
router.get(
  "/add-vehicle",
  checkEmployee,
  utilities.handleErrors(inventoryController.addInventoryView)
);

// Process Adding a New Classification (protected)
router.post(
  "/add-classification",
  checkEmployee,
  utilities.handleErrors(inventoryController.addClassification)
);

// Process Adding a New Vehicle (protected)
router.post(
  "/add-vehicle",
  checkEmployee,
  utilities.handleErrors(inventoryController.addInventory)
);

// Get Inventory JSON by Classification ID (open to visitors)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(inventoryController.getInventoryJSON)
);

// Edit Vehicle View (protected)
router.get(
  "/edit/:inv_id",
  checkEmployee,
  utilities.handleErrors(inventoryController.editInventoryView)
);

// Process Updating Vehicle Information (protected)
router.post(
  "/update",
  checkEmployee,
  utilities.handleErrors(inventoryController.updateInventory)
);

// Delete Vehicle View (Confirmation Page, protected)
router.get(
  "/delete/:inv_id",
  checkEmployee,
  utilities.handleErrors(inventoryController.buildDeleteInventoryView)
);

// Process Deleting Vehicle (protected)
router.post(
  "/delete",
  checkEmployee,
  utilities.handleErrors(inventoryController.deleteInventoryItem)
);

module.exports = router;
