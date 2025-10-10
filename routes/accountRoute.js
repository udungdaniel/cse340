const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const utilities = require("../utilities")

// Registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Login
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Account Management (Protected)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router
