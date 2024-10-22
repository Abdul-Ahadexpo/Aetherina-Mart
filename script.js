document.getElementById("saveSetBtn").addEventListener("click", saveSet);

// Initialize setsData with data from local storage or empty array
let setsData = JSON.parse(localStorage.getItem("setsData")) || [];

// Function to save setsData to local storage
function saveToLocalStorage() {
  localStorage.setItem("setsData", JSON.stringify(setsData));
}

// Render the sets when the page loads
renderSets();

function saveSet() {
  const setName = document.getElementById("orderSetSelect").value;
  const setCost = parseFloat(document.getElementById("setCostInput").value);

  if (!setName || isNaN(setCost)) {
    alert("Please select a set and enter a valid cost.");
    return;
  }

  const setIndex = setsData.findIndex((set) => set.name === setName);
  if (setIndex === -1) {
    // Add new set
    const newSet = {
      name: setName,
      cost: setCost,
      products: [],
      profitLoss: 0,
    };
    setsData.push(newSet);
    saveToLocalStorage(); // Save to local storage after adding the new set
    renderSets();
  } else {
    // Update existing set cost
    setsData[setIndex].cost = setCost;
    saveToLocalStorage(); // Save to local storage after updating the set
    renderSets();
  }
}

function renderSets() {
  const setsContainer = document.getElementById("setsContainer");
  setsContainer.innerHTML = "";

  setsData.forEach((set, setIndex) => {
    // Create Collapse Element for the Set
    const collapse = document.createElement("details");
    collapse.classList.add("set-collapse", "mb-4", "p-4", "border");
    collapse.setAttribute("open", "false");

    // Create Summary Element for the Set
    const summary = document.createElement("summary");
    summary.classList.add("set-summary", "font-bold");
    summary.innerText = `${set.name} - Total Cost: BDT ${set.cost}`;

    // Create Product Inputs Section
    const productInputs = document.createElement("div");
    productInputs.classList.add("product-inputs", "mt-2", "space-y-2");

    // Product Name Input
    const productNameInput = document.createElement("input");
    productNameInput.setAttribute("type", "text");
    productNameInput.classList.add("input", "input-bordered", "w-full");
    productNameInput.placeholder = "Enter product name";

    // Product Cost Input
    const productCostInput = document.createElement("input");
    productCostInput.setAttribute("type", "number");
    productCostInput.classList.add("input", "input-bordered", "w-full");
    productCostInput.placeholder = "Enter product cost";

    // Product Sold Input
    const productSoldInput = document.createElement("input");
    productSoldInput.setAttribute("type", "number");
    productSoldInput.classList.add("input", "input-bordered", "w-full");
    productSoldInput.placeholder = "Enter sold price";

    // Save Product Button
    const saveProductBtn = document.createElement("button");
    saveProductBtn.classList.add("btn", "btn-secondary", "mt-2");
    saveProductBtn.innerText = "Save Product";
    saveProductBtn.addEventListener("click", () => {
      const product = {
        name: productNameInput.value,
        cost: parseFloat(productCostInput.value),
        sold: parseFloat(productSoldInput.value),
      };

      if (product.name && !isNaN(product.cost) && !isNaN(product.sold)) {
        set.products.push(product);
        calculateProfitLoss(set);
        saveToLocalStorage(); // Save to local storage after adding the product
        renderSets();
      } else {
        alert("Please fill all product details.");
      }
    });

    // Append Inputs and Button to productInputs div
    productInputs.appendChild(productNameInput);
    productInputs.appendChild(productCostInput);
    productInputs.appendChild(productSoldInput);
    productInputs.appendChild(saveProductBtn);

    // Profit/Loss Display
    const profitLossDisplay = document.createElement("div");
    profitLossDisplay.classList.add("profit-loss", "mt-2", "text-lg");
    profitLossDisplay.innerText = `Profit/Loss: BDT ${set.profitLoss}`;

    // Append product inputs and profit/loss display to the set collapse
    collapse.appendChild(summary);
    collapse.appendChild(productInputs);
    collapse.appendChild(profitLossDisplay);

    // Create another collapse for products inside the set collapse
    const productsCollapse = document.createElement("details");
    productsCollapse.classList.add(
      "products-collapse",
      "mt-4",
      "p-2",
      "border"
    );
    productsCollapse.setAttribute("open", "false");

    const productsSummary = document.createElement("summary");
    productsSummary.innerText = `Products in ${set.name}`;

    productsCollapse.appendChild(productsSummary);

    // Render each product inside the product collapse
    set.products.forEach((product, productIndex) => {
      const productCollapse = document.createElement("details");
      productCollapse.classList.add(
        "product-collapse",
        "p-2",
        "mt-2",
        "border"
      );
      productCollapse.setAttribute("open", "false");

      const productSummary = document.createElement("summary");
      productSummary.innerText = `${product.name} - Cost: BDT ${product.cost}, Sold: BDT ${product.sold}`;

      // Append product collapse to products collapse
      productCollapse.appendChild(productSummary);
      productsCollapse.appendChild(productCollapse);
    });

    // Append the product collapse to the set collapse
    collapse.appendChild(productsCollapse);

    // Add the entire set collapse to the container
    setsContainer.appendChild(collapse);
  });
}

function calculateProfitLoss(set) {
  const totalCost = set.products.reduce(
    (sum, product) => sum + product.cost,
    0
  );
  const totalSold = set.products.reduce(
    (sum, product) => sum + product.sold,
    0
  );
  set.profitLoss = totalSold - totalCost;
  saveToLocalStorage(); // Save updated profit/loss to local storage
}
