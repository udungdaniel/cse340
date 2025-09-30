/* ***************
 * Error Handler Wrapper
 **************** */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ***************
 * Build navigation (stub for now)
 **************** */
async function getNav() {
  return `
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/inv">Inventory</a></li>
      <li><a href="/about">About</a></li>
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

module.exports = {
  handleErrors,
  getNav,
  buildClassificationGrid,
  buildVehicleDetail
}
