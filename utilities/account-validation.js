/********************************************
 * Handles sanitization and validation for
 * account registration data
 ********************************************/
const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* ****************************************
 * Registration Data Validation Rules
 ****************************************/
validate.registrationRules = () => {
    return [
        // First name: required, trimmed, escaped
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        // Last name: required, trimmed, escaped
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // Email: required, must be valid format
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        // Password: required, strong
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ****************************************
 * Check registration data and return errors or continue
 ****************************************/
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

module.exports = validate
