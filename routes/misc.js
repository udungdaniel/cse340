const express = require("express")
const router = express.Router()
const miscController = require("../controllers/miscController")
const utilities = require("../utilities")

// Route to trigger intentional 500 error
router.get(
    "/error/test",
    utilities.handleErrors(miscController.triggerError)
)

// About page route
router.get(
    "/about",
    utilities.handleErrors(miscController.buildAbout)
)

module.exports = router
