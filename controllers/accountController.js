const utilities = require("../utilities")

const accountController = {}

/* ***************************
 *  Build Login View
 * ************************** */
accountController.buildLogin = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Deliver Registration View
 * ************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      message: null,
      account_firstname: "",
      account_lastname: "",
      account_email: "",
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 *  Process Login
 * ************************** */
accountController.accountLogin = async (req, res, next) => {
  try {
    // TODO: Add login validation & JWT creation here
    res.send("Login process (to be implemented)")
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process Registration
 * ************************** */
accountController.registerAccount = async (req, res, next) => {
  try {
    // TODO: Add registration logic here
    res.send("Registration process (to be implemented)")
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Account Management View
 * ************************** */
accountController.buildAccountManagement = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = accountController
