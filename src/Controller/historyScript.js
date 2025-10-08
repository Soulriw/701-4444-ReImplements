// Variables for history pagination
let allHistory = [];
let currentPage = 1;
const itemsPerPage = 5;

// DOM elements
const historyTableBody = document.getElementById('historyTableBody');
const historyPrevBtn = document.getElementById('historyPrevBtn');
const historyNextBtn = document.getElementById('historyNextBtn');
const historyPageNumbers = document.getElementById('historyPageNumbers');

// Summary elements
const totalBooksElement = document.getElementById('totalBooks');
const totalRevenueElement = document.getElementById('totalRevenue');
const totalOrdersElement = document.getElementById('totalOrders');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize star background if function exists
    if (typeof createStars === 'function') {
        createStars();
    }

    // Load history data
    fetchHistory();
});

// Fetch history data from the server
function fetchHistory() {
    historyTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading purchase history...</td></tr>';
    
    fetch('/api/history')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('History data received:', data);
            allHistory = data || [];
            displayHistory();
            updatePagination();
            updateSummary();
        })
        .catch(error => {
            console.error('Error fetching history:', error);
            historyTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error: ${error.message}</td></tr>`;
            // Reset summary on error
            totalBooksElement.textContent = '0';
            totalRevenueElement.textContent = '0 G';
            totalOrdersElement.textContent = '0';
        });
}

// Display history data based on current page
function displayHistory() {
    historyTableBody.innerHTML = '';

    if (!allHistory || allHistory.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No purchase history found</td></tr>';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allHistory.length);
    const currentPageItems = allHistory.slice(startIndex, endIndex);

    currentPageItems.forEach(item => {
        const row = document.createElement('tr');
        
        // Calculate total price for this item
        const quantity = parseInt(item.quantity) || 0;
        const price = parseFloat(item.sellPrice) || 0;
        const totalPrice = quantity * price;
        
        row.innerHTML = `
            <td>${item.historyID || ''}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="/src/Model/image/books/${item.bookID}.jpg" 
                         alt="${item.bookName}" 
                         class="book-image"
                         onerror="this.src='/src/Model/image/books/default.jpg'">
                    <span>${item.bookName || 'Unknown Book'}</span>
                </div>
            </td>
            <td>${item.categoryName || 'Uncategorized'}</td>
            <td>${quantity}</td>
            <td>${price.toFixed(2)} G.</td>
            <td>${totalPrice.toFixed(2)} G.</td>
            <td>${item.enchantment || 'None'}</td>
        `;
        
        historyTableBody.appendChild(row);
    });
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(allHistory.length / itemsPerPage) || 1;
    
    // Update button states
    historyPrevBtn.disabled = currentPage === 1;
    historyNextBtn.disabled = currentPage === totalPages;
    
    // Update page numbers
    historyPageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageNumber.textContent = i;
        
        pageNumber.addEventListener('click', () => {
            currentPage = i;
            displayHistory();
            updatePagination();
        });
        
        historyPageNumbers.appendChild(pageNumber);
    }
    
    // Add event listeners for pagination buttons
    historyPrevBtn.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            displayHistory();
            updatePagination();
        }
    };
    
    historyNextBtn.onclick = function() {
        if (currentPage < totalPages) {
            currentPage++;
            displayHistory();
            updatePagination();
        }
    };
}

// Update summary statistics
function updateSummary() {
    if (!allHistory || allHistory.length === 0) {
        totalBooksElement.textContent = '0';
        totalRevenueElement.textContent = '0 G';
        totalOrdersElement.textContent = '0';
        return;
    }
    
    // Calculate total books (sum of quantities)
    const totalBooks = allHistory.reduce((sum, item) => {
        return sum + (parseInt(item.quantity) || 0);
    }, 0);
    
    // Calculate total revenue
    const totalRevenue = allHistory.reduce((sum, item) => {
        const quantity = parseInt(item.quantity) || 0;
        const price = parseFloat(item.sellPrice) || 0;
        return sum + (quantity * price);
    }, 0);
    
    // Count total orders (unique history IDs)
    const uniqueOrderIds = new Set();
    allHistory.forEach(item => {
        if (item.historyID) {
            uniqueOrderIds.add(item.historyID);
        }
    });
    
    // Update UI elements
    totalBooksElement.textContent = totalBooks;
    totalRevenueElement.textContent = `${totalRevenue.toFixed(2)} G`;
    totalOrdersElement.textContent = uniqueOrderIds.size;
}