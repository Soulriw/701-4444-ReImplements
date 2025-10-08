let categoryBooks = [];
let currentPage = 1;
const itemsPerPage = 10;
let categoryId = null;
let categoryInfo = {};
let promotionBooks = [];

// Load books when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize star background (if not already handled by homeScript.js)
    if (typeof createStars === 'function') {
        createStars();
    }

    // Get category ID from URL
    const urlParts = window.location.pathname.split('/');
    categoryId = urlParts[urlParts.length - 1];

    // Make sure pagination is hidden initially
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }

    // Fetch promotion books first, then fetch category info and books
    fetchPromotionBooks().then(() => {
        // Fetch category information and books
        fetchCategoryInfo();
        fetchCategoryBooks();
    }).catch(error => {
        console.error("Failed to fetch promotion books:", error);

        // Continue with fetching category info and books
        fetchCategoryInfo();
        fetchCategoryBooks();
    });

    // Setup scroll to top button
    window.onscroll = function () {
        const scrollUpBtn = document.getElementById('scrollUpBtn');
        if (scrollUpBtn) {
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= documentHeight - 100) {
                scrollUpBtn.classList.add('show');
            } else {
                scrollUpBtn.classList.remove('show');
            }
        }
    };
});

// Fetch promotion books from the API
async function fetchPromotionBooks() {
    try {
        console.log("Fetching promotion books from database...");
        const response = await fetch('/api/promotionBooks');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Promotion books from database:", data);

        if (data && data.length > 0) {
            promotionBooks = data;
        } else {
            // If no data returned, use fallback
            console.log("No promotion books in database, using fallback");
        }
    } catch (error) {
        console.error('Error fetching promotion books:', error);
        throw error; // Rethrow to handle in the calling function
    }
}

// Fetch category information
async function fetchCategoryInfo() {
    try {
        const response = await fetch(`/api/categoryInfo/${categoryId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        categoryInfo = await response.json();

        // Update category title and description
        document.getElementById('categoryTitle').textContent = categoryInfo.categoryName + ' Books';

    } catch (error) {
        console.error('Error fetching category information:', error);
        document.getElementById('categoryTitle').textContent = 'Category Not Found';
        document.getElementById('categoryDescription').textContent = 'Sorry, we could not find the requested category.';
    }
}

// Fetch books by category from the API
async function fetchCategoryBooks() {
    try {
        const productsGrid = document.getElementById('categoryProductsGrid');
        productsGrid.innerHTML = '<div class="col-12 text-center"><h2 style="color: #FEC564;">Loading magical collection...</h2></div>';

        // Hide pagination while loading
        document.querySelector('.pagination-container').style.display = 'none';

        const response = await fetch(`/api/category/${categoryId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        categoryBooks = await response.json();

        // Display books and setup pagination
        displayBooks();
        setupPagination();

    } catch (error) {
        console.error('Error fetching books:', error);
        const productsGrid = document.getElementById('categoryProductsGrid');
        productsGrid.innerHTML = '<div class="col-12 text-center"><h2 style="color: #ff4444;">Failed to load books. Please try again later.</h2></div>';
        document.querySelector('.pagination-container').style.display = 'none';
    }
}

// Display books based on the current page
function displayBooks() {
    const productsGrid = document.getElementById('categoryProductsGrid');
    productsGrid.innerHTML = '';

    // If no books to display
    if (categoryBooks.length === 0) {
        productsGrid.innerHTML = '<div class="col-12 text-center"><h2 style="color: #FEC564;">No books found in this category.</h2></div>';
        document.querySelector('.pagination-container').style.display = 'none';
        return;
    }

    // Show pagination when there are results
    document.querySelector('.pagination-container').style.display = 'flex';

    // Calculate range for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, categoryBooks.length);
    const currentPageBooks = categoryBooks.slice(startIndex, endIndex);

    // Create and append book cards
    currentPageBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-6 col-lg';

        // Check if book has a promotion price by using the promotion books list
        const promotionInfo = promotionBooks.find(promo => promo.bookID === book.bookID);
        const hasDiscount = promotionInfo !== undefined;

        // Calculate discount percentage
        const discount = hasDiscount ? Math.round((1 - book.proPrice / book.price) * 100) : 0;

        // Get image URL for the book
        const imageUrl = `/src/Model/image/books/${book.bookID}.jpg`;

        // Create book card HTML
        bookCard.innerHTML = `
        <a href="/productDetail?id=${book.bookID}" class="book-link" style="text-decoration: none; color: inherit;">
            <div class="search-card">
                ${hasDiscount ? `<div class="search-discount-label">${discount}%</div>` : ''}
                <img src="${imageUrl}" alt="${book.bookName}" onerror="this.src='/src/Model/image/books/default.jpg'"/>
                <h2>${book.bookName}</h2>
                <p>${book.bookDescription || 'No description available.'}</p>
                <div class="search-price-tag">
                    ${hasDiscount ? `<span class="search-original-price">${book.price}</span>` : ''}
                    <span class="search-promo-price">${hasDiscount ? book.proPrice : book.price} G</span>
                </div>
            </div>
        </a>
        `;
        productsGrid.appendChild(bookCard);
    });
}

// Create navigation handlers for pagination
const navigationHandlers = {
    prevPage: () => {
        if (currentPage > 1) {
            currentPage--;
            displayBooks();
            updatePaginationState();
            scrollToTop();
        }
    },
    nextPage: () => {
        const totalPages = Math.ceil(categoryBooks.length / itemsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            displayBooks();
            updatePaginationState();
            scrollToTop();
        }
    }
};

// Setup pagination controls
function setupPagination() {
    const paginationContainer = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Remove old event listeners
    prevBtn.removeEventListener('click', navigationHandlers.prevPage);
    nextBtn.removeEventListener('click', navigationHandlers.nextPage);

    // Add new event listeners
    prevBtn.addEventListener('click', navigationHandlers.prevPage);
    nextBtn.addEventListener('click', navigationHandlers.nextPage);

    updatePaginationState();
}

// Update pagination buttons and page indicators
function updatePaginationState() {
    const paginationContainer = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const totalPages = Math.ceil(categoryBooks.length / itemsPerPage);

    // Clear page numbers
    paginationContainer.innerHTML = '';

    // Create page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
            updatePaginationState();
            scrollToTop();
        });
        paginationContainer.appendChild(pageNumber);
    }

    // Update prev/next button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}