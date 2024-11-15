let currentPage = 1;
let productsPerPage = 10;
let allProducts = [];
let filteredProducts = [];

// Function to toggle mobile menu visibility
function toggleMenu() {
  window.scrollTo(0, 0);
  document.getElementById("mobile-nav").classList.toggle("show");
  let showCass = document.querySelector(".show");
  if (showCass) {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  } else {
    window.onscroll = function () {};
  }
}

function showHideFilter(status) {
  window.scrollTo(0, 0);
  document.getElementById("mobile-filter-main").classList.toggle("show");
  let showCass = document.querySelector(".show");
  if (showCass) {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  } else {
    window.onscroll = function () {};
  }
}

// Fetch the product data from the API and display the products
async function fetchProducts() {
  let url = "https://fakestoreapi.com/products";
  try {
    let response = await fetch(url);
    let data = await response.json();
    allProducts = data;
    filteredProducts = data; // Initially show all products
    document.getElementById(
      "total-data"
    ).innerHTML = `${allProducts.length} Results`;
    document.getElementById(
      "see-result"
    ).innerHTML = `See ${filteredProducts.length} Results`;

    showProducts(currentPage);

    createPagination();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Show products based on the current page
function showProducts(page) {
  let productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear existing products

  // Calculate the range of products to display
  let start = (page - 1) * productsPerPage;
  let end = start + productsPerPage;
  let productsToDisplay = filteredProducts.slice(start, end);

  // Display the products
  productsToDisplay.forEach((product) => {
    let productItem = document.createElement("div");
    productItem.classList.add("product-item");

    productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <p>${product.title}</p>
            <p>$${product.price.toFixed(2)}</p>
        `;

    productList.appendChild(productItem);
  });
}

// Create pagination buttons
function createPagination() {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  document.getElementById(
    "total-data"
  ).innerHTML = `${filteredProducts.length} Results`;
  document.getElementById(
    "see-result"
  ).innerHTML = `See ${filteredProducts.length} Results`;
  let totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    let button = document.createElement("button");
    button.textContent = i;

    // Set active class for the current page
    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentPage = i;
      showProducts(currentPage);
      createPagination(); // Recreate pagination to highlight active page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    pagination.appendChild(button);
  }

  let nextButton = document.createElement("button");
  nextButton.textContent = ">";

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showProducts(currentPage);
      createPagination();
    }
  });
  pagination.appendChild(nextButton);

  if (currentPage === totalPages) {
    nextButton.style.cursor = "no-drop";
  }
}

// Sorting functionalit
document.getElementById("sort-option").addEventListener("change", function () {
  let sortValue = this.value;

  if (sortValue === "price-low-to-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-high-to-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
  }

  // Refresh the displayed products and pagination
  currentPage = 1;
  showProducts(currentPage);
  createPagination();
});

let shortStatus = true;

document.getElementById("sort-btn").addEventListener("click", function () {
  shortStatus = !shortStatus;

  if (shortStatus) {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }
  currentPage = 1;
  showProducts(currentPage);
  createPagination();
});

// Filter products based on selected categories and price range
function filterProducts() {
  //document.getElementById('sort-option').value = 'price-high-to-low';
  let selectedCategories = [];
  let priceRangeValue = parseInt(document.getElementById("price-range").value);

  if (document.getElementById("jewellery").checked)
    selectedCategories.push("jewelery");
  if (document.getElementById("electronics").checked)
    selectedCategories.push("electronics");
  if (document.getElementById("mens-clothing").checked)
    selectedCategories.push("men's clothing");
  if (document.getElementById("womens-clothing").checked)
    selectedCategories.push("women's clothing");

  // Filter products based on selected categories
  filteredProducts = allProducts.filter((product) => {
    let isCategoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    let isPriceInRange = product.price <= priceRangeValue;
    console.log(isCategoryMatch, "<====productproduct");
    return isCategoryMatch && isPriceInRange;
  });

  showProducts(currentPage);
  createPagination();
  currentPage = 1;
}

// Add event listener to checkboxes for filtering
document
  .querySelectorAll('.filters input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", filterProducts);
  });

// Add event listener to the price range slider
document.getElementById("price-range").addEventListener("input", function () {
  filterProducts();
  document.getElementById("sort-option").value = "";
});

// Fetch products when the page loads
window.onload = fetchProducts;
