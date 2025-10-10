const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")

function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

async function getNav() {
  try {
    const data = await invModel.getClassifications()
    let nav = "<ul>"
    nav += '<li><a href="/" title="Home page">Home</a></li>'
    data.forEach((row) => {
      nav += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
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

function checkJWTToken(req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        res.clearCookie("jwt")
        req.flash("errors", [{ msg: "Please log in." }])
        return res.redirect("/account/login")
      }
      req.userId = accountData.userId
      res.locals.loggedIn = true
      res.locals.userName = accountData.username
      res.locals.account_type = accountData.account_type
      next()
    })
  } else {
    next()
  }
}

function checkLogin(req, res, next) {
  if (req.userId) {
    next()
  } else {
    req.flash("errors", [{ msg: "Please log in first." }])
    return res.redirect("/account/login")
  }
}

module.exports = {
  handleErrors,
  getNav,
  checkJWTToken,
  checkLogin
}
