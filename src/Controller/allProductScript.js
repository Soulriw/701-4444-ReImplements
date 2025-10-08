let allBooks = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = null;
let promotionBooks = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize stars background if function exists
    if (typeof createStars === 'function') {
        createStars();
    }

    // Hide pagination initially
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }

    // Load books (promotion books first, then all books)
    fetchPromotionBooks().then(() => {
        fetchAllBooks();
    }).catch(error => {
        console.error("Failed to fetch promotion books:", error);
        fetchAllBooks(); // Fallback if promotion fetch fails
    });

    // Setup category filters
    setupCategoryFilters();
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
            console.log("No promotion books in database, using fallback");

        }
    } catch (error) {
        console.error('Error fetching promotion books:', error);
        throw error; // Rethrow to handle in the calling function
    }
}

// Fetch all books from the API
async function fetchAllBooks() {
    try {
        // Show loading message
        const productsGrid = document.getElementById('allProductsGrid');
        productsGrid.innerHTML = '<div class="col-12 text-center"><h2 style="color: #FEC564;">Loading magical collection...</h2></div>';

        // Hide pagination while loading
        document.querySelector('.pagination-container').style.display = 'none';

        // Fetch and process data
        const response = await fetch('/api/allBooks');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allBooks = await response.json();

        // Display books and setup pagination
        displayBooks();
        setupPagination();

    } catch (error) {
        console.error('Error fetching books:', error);
        // Show error message
        const productsGrid = document.getElementById('allProductsGrid');
        productsGrid.innerHTML = '<div class="col-12 text-center"><h2 style="color: #ff4444;">Failed to load books. Please try again later.</h2></div>';
        document.querySelector('.pagination-container').style.display = 'none';
    }
}

// Display books based on the current page and filters
function displayBooks() {
    const productsGrid = document.getElementById('allProductsGrid');
    productsGrid.innerHTML = '';

    // Apply category filter if active
    let filteredBooks = allBooks;
    if (currentCategory) {
        filteredBooks = allBooks.filter(book => book.categoryID == currentCategory);
    }

    // Handle empty results
    if (filteredBooks.length === 0) {
        productsGrid.innerHTML = '<div class="col-12 text-center"><h2 style="color: #FEC564;">No books found in this category.</h2></div>';
        document.querySelector('.pagination-container').style.display = 'none';
        return;
    }

    // Show pagination
    document.querySelector('.pagination-container').style.display = 'flex';

    // Calculate range for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredBooks.length);
    const currentPageBooks = filteredBooks.slice(startIndex, endIndex);

    // Create and append book cards
    currentPageBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-6 col-lg';

        // Check if book has a promotion price by using the list of discounted books
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

// Navigation handler functions
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
        const filteredBooks = currentCategory ?
            allBooks.filter(book => book.categoryID == currentCategory) :
            allBooks;

        const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

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

    // Apply category filter if active
    const filteredBooks = currentCategory ?
        allBooks.filter(book => book.categoryID == currentCategory) :
        allBooks;

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    // Clear page numbers
    paginationContainer.innerHTML = '';

    // Create page number buttons
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

// Setup category filter cards
function setupCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.getAttribute('data-category');

            // Toggle category selection
            if (currentCategory === categoryId) {
                // If clicking already selected category, clear filter
                currentCategory = null;
                // Remove active class from all category cards
                categoryCards.forEach(c => c.classList.remove('active'));
            } else {
                currentCategory = categoryId;
                // Update active class
                categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }

            // Reset to first page when changing category
            currentPage = 1;

            // Update display and pagination
            displayBooks();
            updatePaginationState();

            // Scroll to top of product grid
            document.querySelector('.all-products-container').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Scroll to top of page smoothly
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}