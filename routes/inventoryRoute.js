// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")

/* ***************************
 * Inventory Routes
 * ************************** */

// Show all vehicles (/inv)
router.get(
    "/",
    utilities.handleErrors(invController.buildInventory)
)

// Show vehicles by classification (/inv/type/:classificationId)
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
)

// Show vehicle detail by id (/inv/detail/:invId)
router.get(
    "/detail/:invId",
    utilities.handleErrors(invController.buildByInvId)
)

module.exports = router
