'use strict';

// Get a reference to the classification select element
const classificationList = document.querySelector("#classificationList");

// Add an event listener to load inventory items when a classification is selected
classificationList.addEventListener("change", function () {
  const classificationId = classificationList.value;
  console.log(`Classification ID: ${classificationId}`);

  // Fetch inventory data based on the selected classification
  const classIdURL = `/inv/getInventory/${classificationId}`;
  fetch(classIdURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not OK");
    })
    .then((data) => {
      console.log("Inventory data received:", data);
      buildInventoryList(data);
    })
    .catch((error) => {
      console.error("There was a problem fetching inventory data:", error);
    });
});

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  // Handle empty inventory
  if (!data || data.length === 0) {
    inventoryDisplay.innerHTML = "<p>No inventory items found for this classification.</p>";
    return;
  }

  // Set up the table labels
  let dataTable = `
    <thead>
      <tr>
        <th>Vehicle Name</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
  `;

  // Iterate over all vehicles in the array and put each in a row
  data.forEach((element) => {
    console.log(`${element.inv_id}, ${element.inv_model}`);
    dataTable += `
      <tr>
        <td>${element.inv_make} ${element.inv_model}</td>
        <td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
        <td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>
      </tr>
    `;
  });

  dataTable += "</tbody>";

  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}
