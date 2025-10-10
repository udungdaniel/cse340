const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const accountModel = require("../models/account-model")
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
      errors: req.flash("errors") || [],
      message: req.flash("success")[0] || ""
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build Register View
 * ************************** */
accountController.buildRegister = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: req.flash("errors") || [],
      message: req.flash("success")[0] || "",
      account_firstname: "",
      account_lastname: "",
      account_email: ""
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process Registration
 * ************************** */
accountController.registerAccount = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await accountModel.registerAccount(firstname, lastname, email, hashedPassword)

    if (result && result.account_id) {
      req.flash("success", "Registration successful! Please log in.")
      res.redirect("/account/login")
    } else {
      const nav = await utilities.getNav()
      req.flash("errors", [{ msg: "Registration failed. Please try again." }])
      res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: req.flash("errors"),
        message: "",
        account_firstname: firstname,
        account_lastname: lastname,
        account_email: email
      })
    }
  } catch (error) {
    console.error("Registration Error:", error)
    next(error)
  }
}

/* ***************************
 *  Process Login
 * ************************** */
accountController.accountLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const account = await accountModel.getAccountByEmail(email)

    if (!account) {
      req.flash("errors", [{ msg: "Invalid email or password" }])
      return res.redirect("/account/login")
    }

    const validPassword = await bcrypt.compare(password, account.account_password)
    if (!validPassword) {
      req.flash("errors", [{ msg: "Invalid email or password" }])
      return res.redirect("/account/login")
    }

    const token = jwt.sign(
      {
        userId: account.account_id,
        username: account.account_firstname,
        account_type: account.account_type
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    res.cookie("jwt", token, { httpOnly: true, secure: false })
    req.flash("success", `Welcome back, ${account.account_firstname}!`)
    res.redirect("/account")
  } catch (error) {
    console.error("Login Error:", error)
    next(error)
  }
}

/* ***************************
 *  Build Account Management View
 * ************************** */
accountController.buildAccountManagement = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const userId = req.userId
    const account = await accountModel.getAccountById(userId)

    res.render("account/management", {
      title: "Account Management",
      nav,
      userName: account.account_firstname,
      account_type: account.account_type,
      message: req.flash("success")[0] || "",
      errors: req.flash("errors") || []
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Logout
 * ************************** */
accountController.logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt")
    req.flash("success", "You have been logged out.")
    res.redirect("/")
  } catch (error) {
    next(error)
  }
}

module.exports = accountController
