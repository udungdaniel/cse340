// ***********************
//  Required Resources
// ***********************
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation") // Added validation

// ***********************
//  Routes
// ***********************

// GET route for "My Account" (Login View)
router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

// GET route for Registration View
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
)

// POST route to process registration data
router.post(
    "/register",
    regValidate.registrationRules(),  // validation rules
    regValidate.checkRegData,         // check and return errors if any
    utilities.handleErrors(accountController.registerAccount) // controller
)

// ***********************
//  Export Route
// ***********************
module.exports = router
