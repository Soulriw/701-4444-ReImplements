let currentPage = 1;
const itemsPerPage = 10;
let searchResults = [];
let promotionBooks = []; // Initialize empty array for promotion books


// For support receiving values ​​from URLs
document.addEventListener('DOMContentLoaded', () => {
    // Fetch promotion books first
    fetchPromotionBooks().catch(error => {
        console.error("Failed to fetch promotion books:", error);
    });
    
    // Check for search term in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    
    if (searchTerm) {
        // Set the search input value
        const searchInput = document.querySelector('.search-bar');
        if (searchInput) {
            searchInput.value = searchTerm;
        }
        
        // Perform search
        searchBooks(searchTerm);
    }

    // Handle new searches
    const searchForm = document.querySelector('.search');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSearchTerm = document.querySelector('.search-bar').value.trim();
            
            if (newSearchTerm) {
                // Update URL without reloading page
                const newUrl = `${window.location.pathname}?q=${encodeURIComponent(newSearchTerm)}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
                searchBooks(newSearchTerm);
            }
        });
    }
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

//Search Books
async function searchBooks(searchTerm) {
    const resultsSection = document.getElementById('searchResultsSection');
    const resultsContainer = document.getElementById('searchResults');
    const paginationContainer = document.querySelector('.pagination-container');
    
    if (!resultsSection || !resultsContainer || !paginationContainer) {
        console.error('Required DOM elements not found');
        return;
    }
    
    resultsSection.style.display = 'block';
    paginationContainer.style.display = 'none'; // Hide pagination while searching
    resultsContainer.innerHTML = '<div class="col-12 text-center"><h1 class="searching">Searching...</h1></div>';

    try {
        const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        searchResults = await response.json();
        currentPage = 1;
        displaySearchResults();
        setupPagination();
    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<div class="col-12 text-center"><h1>Error searching books</h1></div>';
        document.querySelector('.pagination-container').style.display = 'none'; // Hide pagination on error
    }
}

function displaySearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    const paginationContainer = document.querySelector('.pagination-container');
    
    if (!resultsContainer || !paginationContainer) {
        console.error('Results container or pagination container not found');
        return;
    }
    
    resultsContainer.innerHTML = '';

    if (searchResults.length === 0) {
        resultsContainer.innerHTML = '<div class="col-12 text-center"><h1>No books found</h1></div>';
        paginationContainer.style.display = 'none'; // Hide pagination if no results
        return;
    }

    paginationContainer.style.display = 'flex'; // Show pagination when there are results

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, searchResults.length);
    const currentPageBooks = searchResults.slice(startIndex, endIndex);

    currentPageBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-6 col-lg';
        
        // Ensure bookID exists
        if (!book.bookID) {
            console.error('Book missing bookID:', book);
            return;
        }
        
        // Check if book has a promotion price by using the promotion books list
        const promotionInfo = promotionBooks.find(promo => promo.bookID === book.bookID);
        const hasDiscount = promotionInfo !== undefined;
        
        // Calculate discount percentage
        const discount = hasDiscount ? Math.round((1 - book.proPrice / book.price) * 100) : 0;

        const imageUrl = `/src/Model/image/books/${book.bookID}.jpg`;
        
        // Use an actual anchor tag to ensure direct navigation
        bookCard.innerHTML = `
            <a href="/productDetail?id=${book.bookID}" class="book-link" style="text-decoration: none; color: inherit;">
                <div class="search-card">
                    ${hasDiscount ? `<div class="search-discount-label">${discount}%</div>` : ''}
                    <img src="${imageUrl}" alt="${book.bookName}" onerror="this.src='/src/Model/image/books/default.jpg'" />
                    <h2>${book.bookName}</h2>
                    <p>${book.bookDescription || 'No description available.'}</p>
                    <div class="search-price-tag">
                        ${hasDiscount ? `<span class="search-original-price">${book.price}</span>` : ''}
                        <span class="search-promo-price">${hasDiscount ? book.proPrice : book.price} G</span>
                    </div>
                </div>
            </a>
        `;
        
        resultsContainer.appendChild(bookCard);
    });
}

// Create a single instance of the navigation handlers
const navigationHandlers = {
    prevPage: () => {
        if (currentPage > 1) {
            currentPage--;
            displaySearchResults();
            updatePaginationState();
            scrollTotop();
        }
    },
    nextPage: () => {
        const totalPages = Math.ceil(searchResults.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displaySearchResults();
            updatePaginationState();
            scrollTotop();
        }
    }
};

function setupPagination() {
    const paginationContainer = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!paginationContainer || !prevBtn || !nextBtn) {
        console.error('Pagination elements not found');
        return;
    }
    
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    // Remove old event listeners
    prevBtn.removeEventListener('click', navigationHandlers.prevPage);
    nextBtn.removeEventListener('click', navigationHandlers.nextPage);

    // Add new event listeners
    prevBtn.addEventListener('click', navigationHandlers.prevPage);
    nextBtn.addEventListener('click', navigationHandlers.nextPage);

    // Create page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => {
            currentPage = i;
            displaySearchResults();
            updatePaginationState();
            scrollTotop();
        });
        paginationContainer.appendChild(pageNumber);
    }

    updatePaginationState();
}

function updatePaginationState() {
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageNumbers = document.querySelectorAll('.page-number');

    if (!prevBtn || !nextBtn) {
        console.error('Pagination buttons not found');
        return;
    }

    // Update prev/next button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Update active page number
    pageNumbers.forEach((pageNumber, index) => {
        pageNumber.classList.toggle('active', index + 1 === currentPage);
    });
}

// Scroll to top function
function scrollTotop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}