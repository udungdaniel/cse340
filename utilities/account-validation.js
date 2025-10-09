const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/* **************************************
 *  Registration Data Validation Rules
 * **************************************/
validate.registrationRules = () => {
    return [
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        body("account_lastname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."),
    ]
}

/* **************************************
 *  Check registration data and return errors
 * **************************************/
validate.checkRegData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render("account/register", {
            title: "Register",
            errors: errors.array(),
            account_firstname: req.body.account_firstname,
            account_lastname: req.body.account_lastname,
            account_email: req.body.account_email,
        })
    }
    next()
}

/* **************************************
 *  Login Data Validation Rules
 * **************************************/
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("Please enter a valid email address."),
        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Password cannot be empty."),
    ]
}

/* **************************************
 *  Check login data and return errors
 * **************************************/
validate.checkLoginData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render("account/login", {
            title: "Login",
            errors: errors.array(),
            account_email: req.body.account_email,
        })
    }
    next()
}

module.exports = validate
