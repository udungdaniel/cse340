/* ****************************************
 * Misc Controller for testing errors
 **************************************** */
const utilities = require("../utilities")
const miscController = {}

/* ************************
 * Trigger an intentional error
 ************************ */
miscController.triggerError = async function (req, res, next) {
    try {
        throw new Error("Intentional Server Error for testing purposes.")
    } catch (err) {
        err.status = 500
        next(err)
    }
}

/* ************************
 * Build About page
 ************************ */
miscController.buildAbout = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()
        res.render("about", {
            title: "About Us",
            nav,
        })
    } catch (err) {
        next(err)
    }
}

module.exports = miscController
