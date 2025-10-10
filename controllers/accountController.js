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
      message: req.flash("success")[0] || null,
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
      account_email: "",
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
      return res.redirect("/account/login")
    }

    const nav = await utilities.getNav()
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: [{ msg: "Registration failed. Please try again." }],
      message: "",
      account_firstname: firstname,
      account_lastname: lastname,
      account_email: email,
    })
  } catch (error) {
    console.error("Registration Error:", error)
    const nav = await utilities.getNav()
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: [{ msg: "An unexpected error occurred: " + error.message }],
      message: "",
      account_firstname: req.body.firstname,
      account_lastname: req.body.lastname,
      account_email: req.body.email,
    })
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
        account_type: account.account_type,
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
      message: req.flash("success")[0] || null,
      errors: req.flash("errors") || [],
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Profile View
 * ************************** */
accountController.buildProfileView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const userId = req.userId
    const account = await accountModel.getAccountById(userId)

    res.render("account/profile", {
      title: "My Profile",
      nav,
      account,
      errors: req.flash("errors") || [],
      message: req.flash("success")[0] || null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Profile
 * ************************** */
accountController.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId
    const { account_firstname, account_email, phone, address } = req.body

    if (!account_firstname || !account_email) {
      req.flash("errors", [{ msg: "Name and email are required." }])
      return res.redirect("/account/profile")
    }

    const updated = await accountModel.updateAccount(userId, account_firstname, account_email, phone, address)

    if (updated) {
      req.flash("success", "Profile updated successfully!")
    } else {
      req.flash("errors", [{ msg: "Profile update failed. Try again." }])
    }

    res.redirect("/account/profile")
  } catch (error) {
    console.error("Profile Update Error:", error)
    req.flash("errors", [{ msg: "An unexpected error occurred: " + error.message }])
    res.redirect("/account/profile")
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
