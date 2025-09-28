/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const baseController = require("./controllers/baseController") // ✅ FIXED
const static = require("./routes/static")
const inventoryRoutes = require("./routes/inventoryRoute")
const miscRoutes = require("./routes/misc")   // error testing
const utilities = require("./utilities")
const errorHandler = require("./middleware/errorHandler")

const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoutes)
app.use("/", miscRoutes)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
* Express Error Handler
*************************/
app.use(errorHandler)

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
