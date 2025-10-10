const { body, validationResult } = require("express-validator")

/* ***************************
 *  Registration Validation Rules
 * ************************** */
function registrationRules() {
    return [
        body("firstname")
            .trim()
            .notEmpty()
            .withMessage("First name is required.")
            .isLength({ max: 50 })
            .withMessage("First name must be under 50 characters."),
        body("lastname")
            .trim()
            .notEmpty()
            .withMessage("Last name is required.")
            .isLength({ max: 50 })
            .withMessage("Last name must be under 50 characters."),
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Email is not valid."),
        body("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long."),
    ]
}

/* ***************************
 *  Login Validation Rules
 * ************************** */
function loginRules() {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password is required"),
    ]
}

/* ***************************
 *  Profile Update Validation Rules
 * ************************** */
function profileUpdateRules() {
    return [
        body("account_firstname")
            .trim()
            .notEmpty()
            .withMessage("Name is required.")
            .isLength({ max: 50 })
            .withMessage("Name must be under 50 characters."),
        body("account_email")
            .trim()
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Email is not valid."),
        body("phone")
            .optional({ checkFalsy: true })
            .trim()
            .isMobilePhone("any")
            .withMessage("Phone number is not valid."),
        body("address")
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ max: 100 })
            .withMessage("Address must be under 100 characters."),
    ]
}

/* ***************************
 *  Validation Error Handler
 * ************************** */
function checkRegData(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array())
        return res.redirect("back")
    }
    next()
}

function checkLoginData(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array())
        return res.redirect("back")
    }
    next()
}

function checkProfileData(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array())
        return res.redirect("/account/profile")
    }
    next()
}

module.exports = {
    registrationRules,
    loginRules,
    profileUpdateRules,
    checkRegData,
    checkLoginData,
    checkProfileData,
}
