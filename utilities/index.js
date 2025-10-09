const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")

/* ***************
 * Error Handler Wrapper
 **************** */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ***************
 * Build Dynamic Navigation
 **************** */
async function getNav() {
  try {
    const data = await invModel.getClassifications()
    let nav = "<ul>"
    nav += '<li><a href="/" title="Home page">Home</a></li>'
    data.forEach((row) => {
      nav += `
        <li>
          <a href="/inv/type/${row.classification_id}" 
             title="See our inventory of ${row.classification_name} vehicles">
             ${row.classification_name}
          </a>
        </li>`
    })
    nav += '<li><a href="/inv" title="Inventory">All Vehicles</a></li>'
    nav += '<li><a href="/account/login" title="My Account">My Account</a></li>'
    nav += "</ul>"
    return nav
  } catch (error) {
    console.error("Error building navigation:", error)
    return `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inv">Inventory</a></li>
        <li><a href="/account/login" title="My Account">My Account</a></li>
      </ul>`
  }
}

/* ***************
 * Build Inventory Grid (for Management View)
 **************** */
async function buildClassificationGrid(data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = `
    <table class="inv-display">
      <thead>
        <tr>
          <th>Vehicle Name</th>
          <th>View</th>
          <th>Modify</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
  `

  data.forEach((vehicle) => {
    grid += `
      <tr>
        <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
        <td><a href="/inv/detail/${vehicle.inv_id}" title="View details for ${vehicle.inv_make} ${vehicle.inv_model}">View</a></td>
        <td><a href="/inv/edit/${vehicle.inv_id}" title="Modify ${vehicle.inv_make} ${vehicle.inv_model}">Modify</a></td>
        <td><a href="/inv/delete/${vehicle.inv_id}" title="Delete ${vehicle.inv_make} ${vehicle.inv_model}">Delete</a></td>
      </tr>
    `
  })

  grid += "</tbody></table>"
  return grid
}

/* ***************
 * Build Vehicle Detail View
 **************** */
async function buildVehicleDetail(vehicle) {
  return `
    <section class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> $${new Intl.NumberFormat().format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat().format(vehicle.inv_miles)} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </section>`
}

/* ***************
 * Build Classification Dropdown List
 **************** */
async function buildClassificationList(selectedId = null) {
  try {
    const classifications = await invModel.getClassifications()
    let list = '<select name="classification_id" id="classificationList" required>'
    list += '<option value="">Select a Classification</option>'
    classifications.forEach((classification) => {
      const selected = classification.classification_id == selectedId ? "selected" : ""
      list += `<option value="${classification.classification_id}" ${selected}>${classification.classification_name}</option>`
    })
    list += "</select>"
    return list
  } catch (error) {
    console.error("buildClassificationList error:", error)
    throw error
  }
}

/* ****************************************
 * Middleware: Check JWT Validity
 **************************************** */
function checkJWTToken(req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else {
    next()
  }
}

/* ****************************************
 * Middleware: Check Login Authorization
 **************************************** */
function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ***************
 * Module Exports
 **************** */
const Util = {
  handleErrors,
  getNav,
  buildClassificationGrid,
  buildVehicleDetail,
  buildClassificationList,
  checkJWTToken,
  checkLogin
}

module.exports = Util