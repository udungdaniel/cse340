const utilities = require("../utilities")

const baseController = {}

/* ***************************
 *  Build Home view
 * ************************** */
baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("index", { title: "Home", nav })
  } catch (err) {
    next(err)
  }
}

module.exports = baseController
