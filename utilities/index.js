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
 * Build dynamic navigation
 **************** */
async function getNav() {
  try {
    const data = await invModel.getClassifications()
    let nav = "<ul>"
    nav += '<li><a href="/" title="Home page">Home</a></li>'
    // dynamically add classifications
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
 * Build vehicle grid
 **************** */
async function buildClassificationGrid(data) {
  let grid = '<ul class="vehicle-grid">'
  data.forEach(vehicle => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <div class="namePrice">
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat().format(vehicle.inv_price)}</span>
        </div>
      </li>`
  })
  grid += "</ul>"
  return grid
}

/* ***************
 * Build vehicle detail
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
 * Build Classification Dropdown for Add Vehicle Form
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
 * Middleware to check token validity
 **************************************** */
function checkJWTToken(req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
 * Middleware to check login (authorization)
 **************************************** */
function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

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
