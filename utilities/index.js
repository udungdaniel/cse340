/* ***************
 * Error Handler Wrapper
 **************** */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ***************
 * Build navigation
 **************** */
async function getNav() {
  return `
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/inv">Inventory</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/account/login" title="My Account">My Account</a></li>
    </ul>
  `
}

/* ***************
 * Build vehicle grid (classification or all inventory)
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
      </li>
    `
  })
  grid += "</ul>"
  return grid
}

/* ***************
 * Build vehicle detail HTML
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
    </section>
  `
}

/* ***************
 * Build Classification Dropdown for Add Vehicle Form
 **************** */
async function buildClassificationList(selectedId = null) {
  const invModel = require("../models/inventory-model")
  try {
    const classifications = await invModel.getClassifications()
    let list = `<select name="classification_id" id="classification_id" required>`
    list += `<option value="">-- Select Classification --</option>`
    classifications.forEach((c) => {
      const selected = selectedId == c.classification_id ? "selected" : ""
      list += `<option value="${c.classification_id}" ${selected}>${c.classification_name}</option>`
    })
    list += `</select>`
    return list
  } catch (error) {
    console.error("buildClassificationList error:", error)
    throw error
  }
}

/* ***************************
 *  Build classification dropdown list
 * ************************** */
const invModel = require("../models/inventory-model")

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

module.exports = {
  handleErrors,
  getNav,
  buildClassificationGrid,
  buildVehicleDetail,
  buildClassificationList
}
