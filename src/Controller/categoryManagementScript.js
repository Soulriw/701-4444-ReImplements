// Variables for category scrolling
let allCategories = [];
const categoriesPerScroll = 20; // Number of categories to load per scroll

// DOM elements
const tableScrollContainer = document.querySelector(".table-scroll-container");
const categoryTable = document.getElementById("categoryTable");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryModal = document.getElementById("categoryModal");
const deleteModal = document.getElementById("deleteModal");
const categoryForm = document.getElementById("categoryForm");
const closeModalBtn = document.querySelector(".close-modal");
const cancelBtn = document.querySelector(".cancel-btn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const saveButton = document.getElementById("saveButton");
const formOverlay = document.getElementById("formOverlay");
const deleteOverlay = document.getElementById("deleteOverlay");

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize star background if function exists
    if (typeof createStars === "function") {
        createStars();
    }

    // Load categories
    await fetchCategories();

    // Set up event listeners
    setupEventListeners();
});

// Fetch all categories from the server
async function fetchCategories() {
    try {
        // Use the new endpoint that returns categories sorted by name
        const response = await fetch("/api/categories/sorted-by-name");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        allCategories = await response.json();
        displayCategories();
    } catch (error) {
        console.error("Error fetching categories:", error);
        categoryTable.innerHTML = `<tr><td colspan="2" class="text-center text-danger">Error: ${error.message}</td></tr>`;
    }
}

// Display categories with infinite scroll
function displayCategories() {
    // Get the correct table body element
    const categoryTable = document.getElementById("categoryTable");
    
    // Clear existing content
    categoryTable.innerHTML = '';

    if (allCategories.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 2;
        cell.classList.add("text-center");
        cell.textContent = "No categories found";
        row.appendChild(cell);
        categoryTable.appendChild(row);
        return;
    }

    // Display initial set of categories
    const categoriesToDisplay = allCategories.slice(0, categoriesPerScroll);
    
    categoriesToDisplay.forEach((category) => {
        const row = document.createElement('tr');
        
        // Name column (80% width)
        const nameCell = document.createElement('td');
        nameCell.classList.add("name-column");
        nameCell.textContent = escapeHTML(category.categoryName);
        row.appendChild(nameCell);
        
        // Action column (20% width)
        const actionCell = document.createElement('td');
        actionCell.classList.add("action-column");
        actionCell.innerHTML = `
            <div class="action-icons">
                <i class="fas fa-edit edit-icon" data-id="${category.categoryID}" data-name="${escapeHTML(category.categoryName)}"></i>
                <i class="fas fa-trash-alt delete-icon" data-id="${category.categoryID}"></i>
            </div>
        `;
        row.appendChild(actionCell);
        
        // Add the row to the table
        categoryTable.appendChild(row);
    });

    // Add event listeners for edit and delete icons
    addActionIconListeners();
}

// Add event listeners for edit and delete icons
function addActionIconListeners() {
    document.querySelectorAll(".edit-icon").forEach((icon) => {
        icon.addEventListener("click", () => {
            openEditModal(icon.dataset.id, icon.dataset.name);
        });
    });

    document.querySelectorAll(".delete-icon").forEach((icon) => {
        icon.addEventListener("click", () => {
            openDeleteModal(icon.dataset.id);
        });
    });
}

// Infinite scroll functionality
function setupInfiniteScroll() {
    let currentIndex = categoriesPerScroll;

    tableScrollContainer.addEventListener("scroll", () => {
        // Check if scrolled to bottom
        if (tableScrollContainer.scrollHeight - tableScrollContainer.scrollTop === tableScrollContainer.clientHeight) {
            // Load more categories
            const remainingCategories = allCategories.slice(currentIndex, currentIndex + categoriesPerScroll);
            
            remainingCategories.forEach((category) => {
                const row = categoryTable.insertRow();
                
                // Name column (80% width)
                const nameCell = row.insertCell(0);
                nameCell.classList.add("name-column");
                nameCell.textContent = escapeHTML(category.categoryName);
                
                // Action column (20% width)
                const actionCell = row.insertCell(1);
                actionCell.classList.add("action-column");
                actionCell.innerHTML = `
                    <div class="action-icons">
                        <i class="fas fa-edit edit-icon" data-id="${category.categoryID}" data-name="${escapeHTML(category.categoryName)}"></i>
                        <i class="fas fa-trash-alt delete-icon" data-id="${category.categoryID}"></i>
                    </div>
                `;
            });

            // Add event listeners for new icons
            addActionIconListeners();

            // Update current index
            currentIndex += categoriesPerScroll;
        }
    });
}

// Open modal for adding a new category
function openAddModal() {
    document.getElementById("modalTitle").textContent = "Add New Category";
    categoryForm.reset();
    document.getElementById("categoryID").value = "";

    // Display the modal
    categoryModal.style.display = "flex";
}

// Open modal for editing a category
function openEditModal(categoryId, currentName) {
    document.getElementById("modalTitle").textContent = "Edit Category";
    
    // Fill form fields
    document.getElementById("categoryID").value = categoryId;
    document.getElementById("categoryName").value = currentName;

    // Display the modal
    categoryModal.style.display = "flex";
}

// Open modal for confirming deletion
function openDeleteModal(categoryId) {
    // Store categoryId for deletion
    confirmDeleteBtn.dataset.categoryId = categoryId;

    // Display the modal
    deleteModal.style.display = "flex";
}

// Utility function to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
}

// Save category data (add or update)
async function saveCategory(formData) {
    // Prevent repeated pressing
    if (saveButton.classList.contains('loading')) {
        return;
    }

    // Show loading status
    saveButton.classList.add('loading');
    formOverlay.classList.add('active');

    try {
        const categoryId = formData.get("categoryID");
        const isUpdate = categoryId !== "";
        const categoryName = formData.get("categoryName");

        // Validate input (optional)
        if (!categoryName || categoryName.trim().length < 2) {
            alert("Category name must be at least 2 characters long.");
            saveButton.classList.remove('loading');
            formOverlay.classList.remove('active');
            return;
        }

        const endpoint = isUpdate ? `/api/categories/${categoryId}` : "/api/categories";
        const method = isUpdate ? "PUT" : "POST";

        const response = await fetch(endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                categoryName: categoryName
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Server error:', errorData);
            throw new Error(errorData || `HTTP error! Status: ${response.status}`);
        }

        // Refresh category list
        await fetchCategories();

        // Close modal
        categoryModal.style.display = "none";
    } catch (error) {
        console.error("Detailed error saving category:", error);
        alert(`Failed to save category: ${error.message}`);
    } finally {
        // Reset the button state regardless of success or error
        saveButton.classList.remove('loading');
        formOverlay.classList.remove('active');
    }
}

// Delete a category
async function deleteCategory(categoryId) {
    // Prevent repeated pressing
    if (confirmDeleteBtn.classList.contains('loading')) {
        return;
    }

    // Show loading status
    confirmDeleteBtn.classList.add('loading');
    deleteOverlay.classList.add('active');

    try {
        const response = await fetch(`/api/categories/${categoryId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        // Refresh category list
        await fetchCategories();

        // Close modal
        deleteModal.style.display = "none";
    } catch (error) {
        console.error("Error deleting category:", error);
        alert(`Failed to delete category: ${error.message}`);
    } finally {
        // Reset the button state regardless of success or error
        confirmDeleteBtn.classList.remove('loading');
        deleteOverlay.classList.remove('active');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Add Category button
    addCategoryBtn.addEventListener("click", openAddModal);

    // Close modal buttons
    closeModalBtn.addEventListener("click", () => {
        // Check if loading before allowing close
        if (saveButton.classList.contains('loading')) {
            return; // If loading, do not allow closing modal
        }
        categoryModal.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
        // Check if loading before allowing close
        if (saveButton.classList.contains('loading')) {
            return; // If loading, do not allow closing modal
        }
        categoryModal.style.display = "none";
    });

    // Delete modal buttons
    cancelDeleteBtn.addEventListener("click", () => {
        // Check if loading before allowing close
        if (confirmDeleteBtn.classList.contains('loading')) {
            return; // If loading, do not allow closing modal
        }
        deleteModal.style.display = "none";
    });

    confirmDeleteBtn.addEventListener("click", () => {
        // Prevent action if already loading
        if (confirmDeleteBtn.classList.contains('loading')) {
            return;
        }
        deleteCategory(confirmDeleteBtn.dataset.categoryId);
    });

    // Form submission
    categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Prevent submission if already loading
        if (saveButton.classList.contains('loading')) {
            return;
        }
        
        const formData = new FormData(categoryForm);
        saveCategory(formData);
    });

    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === categoryModal) {
            // Check if loading before allowing close
            if (saveButton.classList.contains('loading')) {
                return; // If loading, do not allow closing modal
            }
            categoryModal.style.display = "none";
        }
        if (e.target === deleteModal) {
            // Check if loading before allowing close
            if (confirmDeleteBtn.classList.contains('loading')) {
                return; // If loading, do not allow closing modal
            }
            deleteModal.style.display = "none";
        }
    });

    // Add infinite scroll setup
    setupInfiniteScroll();
}