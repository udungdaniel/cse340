/* ****************************************
 * Global Error Handling Middleware
 **************************************** */
const utilities = require("../utilities")

async function errorHandler(err, req, res, next) {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)

    let message
    if (err.status == 404) {
        message = err.message
    } else {
        message = "Oh no! There was a crash. Maybe try a different route?"
    }

    res.status(err.status || 500).render("errors/error", {
        title: err.status || "Server Error",
        message,
        nav
    })
}

module.exports = errorHandler
