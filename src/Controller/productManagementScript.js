// Variables for category pagination
let allCategories = [];
let currentCategoryPage = 1;
const categoriesPerPage = 3;

// Variables for product pagination
let allProducts = [];
let filteredProducts = [];
let currentProductPage = 1;
const productsPerPage = 4;
let selectedCategoryId = null;

// DOM elements
const categoryPrevBtn = document.getElementById("categoryPrevBtn");
const categoryNextBtn = document.getElementById("categoryNextBtn");
const categoryPageNumbers = document.getElementById("categoryPageNumbers");
const productPrevBtn = document.getElementById("productPrevBtn");
const productNextBtn = document.getElementById("productNextBtn");
const productPageNumbers = document.getElementById("productPageNumbers");
const productsTableBody = document.getElementById("productsTableBody");
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const deleteModal = document.getElementById("deleteModal");
const productForm = document.getElementById("productForm");
const closeModalBtn = document.querySelector(".close-modal");
const cancelBtn = document.querySelector(".cancel-btn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize star background if function exists
    if (typeof createStars === "function") {
        createStars();
    }

    // Load categories and products
    await fetchCategories();
    await fetchProducts();

    // Set up event listeners
    setupEventListeners();
});

// Fetch all categories from the server
async function fetchCategories() {
    try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        allCategories = await response.json();

        // Set first category as selected by default
        if (allCategories.length > 0) {
            selectedCategoryId = allCategories[0].categoryID;
        }

        displayCategories();
        updateCategoryPagination();
    } catch (error) {
        console.error("Error fetching categories:", error);
        // Use fallback categories from the page
        const categoryCards = document.querySelectorAll(".category-card");
        if (categoryCards.length > 0) {
            selectedCategoryId = categoryCards[0].dataset.category;
        }
    }
}

// Fetch all products from the server
async function fetchProducts() {
    try {
        const response = await fetch("/api/allBooks");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        allProducts = await response.json();

        // Fetch promotion books
        const promoResponse = await fetch("/api/promotionBooks");
        if (promoResponse.ok) {
            const promoBooks = await promoResponse.json();
            
            // Map promo prices to the main products
            // Note: books without promotions will have proPrice set to undefined
            allProducts = allProducts.map((product) => {
                const promoProduct = promoBooks.find(
                    (p) => p.bookID === product.bookID
                );
                if (promoProduct && promoProduct.proPrice) {
                    return {
                        ...product,
                        proPrice: promoProduct.proPrice,
                    };
                }
                // Explicitly set proPrice to undefined for non-promo books
                return {
                    ...product,
                    proPrice: undefined
                };
            });
            
            // Debug: Log the first few products to check proPrice values
            console.log("Sample products with promotion status:", 
                        allProducts.slice(0, 3).map(p => ({
                            bookID: p.bookID,
                            bookName: p.bookName,
                            proPrice: p.proPrice
                        })));
        }

        filterProductsByCategory();
    } catch (error) {
        console.error("Error fetching products:", error);
        displayProducts([]);
    }
}

// Display categories based on current page
function displayCategories() {
    const categoriesWrapper = document.querySelector(".categories-wrapper");
    categoriesWrapper.innerHTML = "";

    const startIdx = (currentCategoryPage - 1) * categoriesPerPage;
    const endIdx = startIdx + categoriesPerPage;
    const visibleCategories = allCategories.slice(startIdx, endIdx);

    visibleCategories.forEach((category, index) => {
        const categoryCard = document.createElement("div");
        categoryCard.className = `category-card ${category.categoryID === selectedCategoryId ? "active" : ""
            }`;
        categoryCard.dataset.category = category.categoryID;
        categoryCard.innerHTML = `<span>${category.categoryName}</span>`;

        // Add click event
        categoryCard.addEventListener("click", () => {
            selectCategory(category.categoryID);
        });

        categoriesWrapper.appendChild(categoryCard);
    });
}

// Filter products by selected category
function filterProductsByCategory() {
    if (selectedCategoryId) {
        filteredProducts = allProducts.filter(
            (product) => product.categoryID == selectedCategoryId
        );
    } else {
        filteredProducts = [...allProducts];
    }

    // Added sorting by bookName in DESC format
    filteredProducts.sort((a, b) => {
        if (a.bookName > b.bookName) return -1;
        if (a.bookName < b.bookName) return 1;
        return 0;
    });

    // Reset to first page when changing category
    currentProductPage = 1;

    displayProducts();
    updateProductPagination();
}

// Display products based on current page
function displayProducts() {
    productsTableBody.innerHTML = "";

    if (filteredProducts.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No products found for this category</td>
            </tr>
        `;
        return;
    }

    const startIdx = (currentProductPage - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const visibleProducts = filteredProducts.slice(startIdx, endIdx);

    visibleProducts.forEach((product) => {
        const row = document.createElement("tr");

        // Product image and name
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="/src/Model/image/books/${product.bookID}.jpg" 
                         alt="${product.bookName}" 
                         class="product-image"
                         onerror="this.src='/src/Model/image/books/default.jpg'">
                    <span>${product.bookName}</span>
                </div>
            </td>
            <td>
                <button class="show-btn" data-description="${encodeURIComponent(
            product.bookDescription || "No description available."
        )}">
                    Show
                </button>
            </td>
            <td>${product.proPrice ? product.proPrice + " G." : "-"}</td>
            <td>${product.price} G.</td>
            <td>
                <div class="action-icons">
                    <i class="fas fa-edit edit-icon" data-id="${product.bookID
            }"></i>
                    <i class="fas fa-trash-alt delete-icon" data-id="${product.bookID
            }"></i>
                </div>
            </td>
        `;

        productsTableBody.appendChild(row);
    });

    // Add event listeners for show buttons
    document.querySelectorAll(".show-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const description = decodeURIComponent(btn.dataset.description);
            openDescriptionModal(description);
        });
    });

    // Add event listeners for edit and delete icons
    document.querySelectorAll(".edit-icon").forEach((icon) => {
        icon.addEventListener("click", () => {
            openEditModal(icon.dataset.id);
        });
    });

    document.querySelectorAll(".delete-icon").forEach((icon) => {
        icon.addEventListener("click", () => {
            openDeleteModal(icon.dataset.id);
        });
    });

    // Add event listener for close button Description Modal
    document
        .getElementById("closeDescriptionModal")
        .addEventListener("click", () => {
            document.getElementById("descriptionModal").style.display = "none";
        });

    document
        .getElementById("closeDescriptionBtn")
        .addEventListener("click", () => {
            document.getElementById("descriptionModal").style.display = "none";
        });

    // Close Modal when clicking outside the Modal area
    window.addEventListener("click", (e) => {
        const descriptionModal = document.getElementById("descriptionModal");
        if (e.target === descriptionModal) {
            descriptionModal.style.display = "none";
        }
    });
}

// Update category pagination display
function updateCategoryPagination() {
    const totalPages = Math.ceil(allCategories.length / categoriesPerPage);

    // Update button states
    categoryPrevBtn.disabled = currentCategoryPage === 1;
    categoryNextBtn.disabled =
        currentCategoryPage === totalPages || totalPages === 0;

    // Update page numbers
    categoryPageNumbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement("div");
        pageNumber.className = `page-number ${i === currentCategoryPage ? "active" : ""
            }`;
        pageNumber.textContent = i;

        pageNumber.addEventListener("click", () => {
            currentCategoryPage = i;
            displayCategories();
            updateCategoryPagination();
        });

        categoryPageNumbers.appendChild(pageNumber);
    }
}

// Update product pagination display
function updateProductPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Update button states
    productPrevBtn.disabled = currentProductPage === 1;
    productNextBtn.disabled =
        currentProductPage === totalPages || totalPages === 0;

    // Update page numbers
    productPageNumbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement("div");
        pageNumber.className = `page-number ${i === currentProductPage ? "active" : ""
            }`;
        pageNumber.textContent = i;

        pageNumber.addEventListener("click", () => {
            currentProductPage = i;
            displayProducts();
            updateProductPagination();
        });

        productPageNumbers.appendChild(pageNumber);
    }
}

// Select a category and update display
function selectCategory(categoryId) {
    selectedCategoryId = categoryId;

    // Update active class on category cards
    document.querySelectorAll(".category-card").forEach((card) => {
        if (card.dataset.category == categoryId) {
            card.classList.add("active");
        } else {
            card.classList.remove("active");
        }
    });

    filterProductsByCategory();
}

// Open modal for adding a new product
function openAddModal() {
    document.getElementById("modalTitle").textContent = "Add New Product";
    productForm.reset();
    document.getElementById("bookID").value = "";
    
    // Set default state for promotion fields
    document.getElementById("isPromotionBook").checked = false;
    const proPriceInput = document.getElementById("proPrice");
    proPriceInput.disabled = true;
    proPriceInput.style.opacity = 0.5;
    
    // Display the modal
    productModal.style.display = "flex";
}

// Open modal for editing a product
function openEditModal(bookId) {
    document.getElementById("modalTitle").textContent = "Edit Product";

    // Find the product
    const product = allProducts.find((p) => p.bookID == bookId);
    if (!product) return;

    // Fill form fields
    document.getElementById("bookID").value = product.bookID;
    document.getElementById("bookName").value = product.bookName;
    document.getElementById("categoryID").value = product.categoryID;
    document.getElementById("bookDescription").value = product.bookDescription || "";
    document.getElementById("price").value = product.price;
    
    // A book is in promotion if it has a proPrice value that is not null, undefined, or empty string
    const hasPromotion = product.proPrice !== undefined && 
                         product.proPrice !== null && 
                         product.proPrice !== "" &&
                         !isNaN(parseFloat(product.proPrice));
    
    // Set promotion price field
    document.getElementById("proPrice").value = hasPromotion ? product.proPrice : "";
    
    // Set the promotion checkbox state
    const isPromotionBookCheckbox = document.getElementById("isPromotionBook");
    isPromotionBookCheckbox.checked = hasPromotion;
    
    // Enable/disable the proPrice input based on the checkbox state
    const proPriceInput = document.getElementById("proPrice");
    proPriceInput.disabled = !hasPromotion;
    proPriceInput.style.opacity = hasPromotion ? 1 : 0.5;

    // Display the modal
    productModal.style.display = "flex";
    
    // Log for debugging
    console.log(`Book ID: ${product.bookID}, Has Promotion: ${hasPromotion}`, `proPrice: ${product.proPrice}, Type: ${typeof product.proPrice}`);
}

// Open modal for confirming deletion
function openDeleteModal(bookId) {
    // Store bookId for deletion
    confirmDeleteBtn.dataset.bookId = bookId;

    // Display the modal
    deleteModal.style.display = "flex";
}

function openDescriptionModal(description) {
    const descriptionModal = document.getElementById("descriptionModal");
    const descriptionContent = document.getElementById("descriptionContent");

    // set the data for description
    descriptionContent.textContent = description;

    // show the modal
    descriptionModal.style.display = "flex";
}

// Save product data (add or update)
async function saveProduct(formData) {
    const bookId = formData.get("bookID");

    // Validate inputs
    const bookName = formData.get("bookName").trim();
    const categoryID = formData.get("categoryID");
    const bookDescription = formData.get("bookDescription").trim();
    const price = parseFloat(formData.get("price"));
    const isPromotionBook = formData.get("isPromotionBook") === 'true';
    
    // Only use proPrice if isPromotionBook is true
    let proPrice = null;
    if (isPromotionBook) {
        proPrice = parseFloat(formData.get("proPrice"));
        
        // Validation for promotion price
        if (isNaN(proPrice) || proPrice <= 0) {
            alert("Please enter a valid promotion price.");
            return;
        }
        
        // Check that promotion price is lower than regular price
        if (proPrice >= price) {
            alert("Promotion price must be lower than the original price.");
            return;
        }
    }

    // Validation checks
    if (!bookName || bookName.length < 3) {
        alert("Book name must be at least 3 characters long.");
        return;
    }

    if (!categoryID) {
        alert("Please select a category.");
        return;
    }

    if (!bookDescription || bookDescription.length < 10) {
        alert("Description must be at least 10 characters long.");
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    // Disable Save button and show loading
    const saveButton = document.getElementById('saveButton');
    const formOverlay = document.getElementById('formOverlay');

    // Prevent repeated pressing
    if (saveButton.classList.contains('loading')) {
        return;
    }

    // Show loading status
    saveButton.classList.add('loading');
    formOverlay.classList.add('active');

    try {
        // Prepare data for API request
        const requestData = {
            bookID: bookId,
            bookName,
            categoryID,
            bookDescription,
            price,
            proPrice, // This will be null if isPromotionBook is false
            isPromotionBook: isPromotionBook.toString()
        };

        // Send data to server
        const endpoint = bookId ? `/api/books/${bookId}` : "/api/books";
        const method = bookId ? "PUT" : "POST";

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Refresh the product list
        await fetchProducts();

        // Close modal
        productModal.style.display = "none";

    } catch (error) {
        console.error('Error saving product:', error);
        alert("Failed to save product. Please try again.");
    } finally {
        // Reset the button state regardless of success or error.
        saveButton.classList.remove('loading');
        formOverlay.classList.remove('active');
    }
}

// Delete a product
async function deleteProduct(bookId) {
    // Disable the button and display the loading status
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteOverlay = document.getElementById('deleteOverlay');

    // Prevent repeated pressing
    if (confirmDeleteBtn.classList.contains('loading')) {
        return;
    }

    // Show loading status
    confirmDeleteBtn.classList.add('loading');
    deleteOverlay.classList.add('active');

    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Refresh product list
        await fetchProducts();

        // Close modal
        deleteModal.style.display = "none";
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
    } finally {
        // Reset the button state regardless of success or error.
        confirmDeleteBtn.classList.remove('loading');
        deleteOverlay.classList.remove('active');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Category pagination
    categoryPrevBtn.addEventListener("click", () => {
        if (currentCategoryPage > 1) {
            currentCategoryPage--;
            displayCategories();
            updateCategoryPagination();
        }
    });

    categoryNextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(allCategories.length / categoriesPerPage);
        if (currentCategoryPage < totalPages) {
            currentCategoryPage++;
            displayCategories();
            updateCategoryPagination();
        }
    });

    // Product pagination
    productPrevBtn.addEventListener("click", () => {
        if (currentProductPage > 1) {
            currentProductPage--;
            displayProducts();
            updateProductPagination();
        }
    });

    productNextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (currentProductPage < totalPages) {
            currentProductPage++;
            displayProducts();
            updateProductPagination();
        }
    });

    // Add Product button
    addProductBtn.addEventListener("click", openAddModal);

    // Close modal buttons
    closeModalBtn.addEventListener("click", () => {
        // Check if it is loading
        const saveButton = document.getElementById('saveButton');
        if (saveButton.classList.contains('loading')) {
            return; // If loading, do not allow closing modal.
        }
        productModal.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
        // Check if it is loading
        const saveButton = document.getElementById('saveButton');
        if (saveButton.classList.contains('loading')) {
            return; // If loading, do not allow closing modal.
        }
        productModal.style.display = "none";
    });

    // Delete modal buttons
    cancelDeleteBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";
    });

    confirmDeleteBtn.addEventListener("click", () => {
        // Prevent repeated pressing
        if (confirmDeleteBtn.classList.contains('loading')) {
            return;
        }
        deleteProduct(confirmDeleteBtn.dataset.bookId);
    });

    // Add event listener for promotion toggle checkbox
    document.getElementById('isPromotionBook').addEventListener('change', function() {
        const proPriceInput = document.getElementById('proPrice');
        proPriceInput.disabled = !this.checked;
        proPriceInput.style.opacity = this.checked ? 1 : 0.5;
    });
    
    // Initialize the promotion toggle and price field when the add button is clicked
    addProductBtn.addEventListener("click", () => {
        openAddModal();
        
        // Set default state for promotion price field in add mode
        const isPromotionBookCheckbox = document.getElementById("isPromotionBook");
        isPromotionBookCheckbox.checked = false;
        
        const proPriceInput = document.getElementById("proPrice");
        proPriceInput.disabled = true;
        proPriceInput.style.opacity = 0.5;
    });

    // Form submission
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(productForm);
    
        // Convert checkbox to string value
        const isPromotionBook = document.getElementById('isPromotionBook').checked;
        formData.set('isPromotionBook', isPromotionBook.toString());

        // Check if it is loading
        const saveButton = document.getElementById('saveButton');
        if (saveButton.classList.contains('loading')) {
            return; // If it is already loading, do not submit the form again.
        }

        saveProduct(formData);
    });

    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === productModal) {
            // Check the loading status before closing the modal.
            const saveButton = document.querySelector('.save-btn');
            if (saveButton && saveButton.classList.contains('loading')) {
                return;
            }
            productModal.style.display = "none";
        }
        if (e.target === deleteModal) {
            // Check the loading status before closing the modal.
            const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
            if (confirmDeleteBtn.classList.contains('loading')) {
                return;
            }
            deleteModal.style.display = "none";
        }
    });
}
