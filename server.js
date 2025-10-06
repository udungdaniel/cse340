const express = require("express")
const session = require("express-session")
const expressLayouts = require("express-ejs-layouts")
const pool = require("./database/")
require("dotenv").config()
const bodyParser = require("body-parser")

// Controllers & routes
const baseController = require("./controllers/baseController")
const staticRoutes = require("./routes/static")
const inventoryRoutes = require("./routes/inventoryRoute")
const accountRoutes = require("./routes/accountRoute")
const miscRoutes = require("./routes/misc")
const utilities = require("./utilities")
const errorHandler = require("./middleware/errorHandler")

const app = express()

// Session setup
app.use(session({
  store: new (require("connect-pg-simple")(session))({ createTableIfMissing: true, pool }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}))

// Flash messages
app.use(require("connect-flash")())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// View engine
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.use(express.static("public"))

// Routes
app.use(staticRoutes)
app.use("/inv", inventoryRoutes)
app.use("/account", accountRoutes)
app.use("/", miscRoutes)
app.get("/", utilities.handleErrors(baseController.buildHome))

// 404
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

// Error handler
app.use(errorHandler)

// Server
const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
