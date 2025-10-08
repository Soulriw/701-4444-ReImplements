// Logo toggle
function toggleNav() {
    document.getElementById("nav").classList.toggle("hidden");
}

// Stars Background
document.addEventListener('DOMContentLoaded', function() {
    createStars();
});

function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 100; 

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3;
        
        // Random animation duration
        const duration = 2 + Math.random() * 3;
        
        star.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            --duration: ${duration}s;
        `;
        
        starsContainer.appendChild(star);
    }
}
// Stars Background End

// Book Seller
document.addEventListener('DOMContentLoaded', function() {
    const books = document.querySelectorAll('.book');
    
    books.forEach(book => {
        book.addEventListener('mouseenter', function() {
            const isCenter = this.classList.contains('center');
            
            if (isCenter) {
                this.style.transform = 'translateY(-65px) scale(1.05)';
            } else {
                this.style.transform = 'scale(1.1)';
            }
            
            this.style.filter = 'drop-shadow(0 0 10px rgba(255, 182, 58, 0.8))';
            this.style.transition = 'all 0.3s ease';
            
            const crown = this.querySelector('.crown img');
            if (crown) {
                crown.style.transform = 'scale(1.1)';
                crown.style.filter = 'brightness(1.2)';
                crown.style.transition = 'all 0.3s ease';
            }
        });
        
        book.addEventListener('mouseleave', function() {
            if (this.classList.contains('center')) {
                this.style.transform = 'translateY(-50px)';
            } else {
                this.style.transform = 'none';
            }
            
            this.style.filter = 'none';
            
            const crown = this.querySelector('.crown img');
            if (crown) {
                crown.style.transform = 'none';
                crown.style.filter = 'none';
            }
        });
        
        book.addEventListener('click', function() {
            this.style.transform = this.classList.contains('center') ? 
                'translateY(-50px) scale(0.95)' : 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = this.classList.contains('center') ? 
                    'translateY(-50px)' : 'none';
            }, 150);
            
            });
    });
});
// Best Seller End

// Promotion Books
document.addEventListener('DOMContentLoaded', function() {
    // Variables for pagination
    let currentPromotionPage = 1;
    const itemsPerPage = 5; 
    let promotionBooks = [];
    
    const promotionBooksContainer = document.getElementById('promotionBooksContainer');
    if (promotionBooksContainer) {
        try {
            promotionBooks = JSON.parse(promotionBooksContainer.dataset.books || '[]');
        } catch (error) {
            console.error('Error parsing books data:', error);
        }
    }
    
    if (promotionBooks.length === 0) return;
    
    const totalPages = Math.ceil(promotionBooks.length / itemsPerPage);
    if (totalPages <= 1) return;
    
    function displayPromotionBooks() {
        const booksContainer = document.querySelector('#promotionBooksContainer .row');
        if (!booksContainer) return;
        
        const startIndex = (currentPromotionPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, promotionBooks.length);
        const currentPageBooks = promotionBooks.slice(startIndex, endIndex);
        
        booksContainer.innerHTML = '';
        
        currentPageBooks.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'col-6 col-lg';
            bookElement.innerHTML = `
                <a href="/productDetail?id=${book.bookID}" style="text-decoration: none; color: inherit;">
                    <div class="book-card">
                        <div class="discount-label">${book.discountPercentage}%</div>
                        <img 
                            src="/src/Model/image/books/${book.bookID}.jpg" 
                            alt="${book.bookName}" 
                            onerror="this.src='/src/Model/image/books/default.jpg'"
                        />
                        <h2>${book.bookName}</h2>
                        <p>${book.bookDescription || 'No description available.'}</p>
                        <div class="price-tag">
                            <span class="original-price">${book.price}</span>
                            <span class="promo-price">${book.proPrice} G</span>
                        </div>
                    </div>
                </a>
            `;
            booksContainer.appendChild(bookElement);
        });
    }
    
    function updatePaginationState() {
        const pageNumbers = document.querySelectorAll('.promotion-pagination .page-number');
        const prevBtn = document.querySelector('.promotion-pagination .prev-btn');
        const nextBtn = document.querySelector('.promotion-pagination .next-btn');
        
        if (prevBtn) prevBtn.disabled = currentPromotionPage === 1;
        if (nextBtn) nextBtn.disabled = currentPromotionPage === totalPages;
        
        pageNumbers.forEach(pageNumber => {
            const pageNum = parseInt(pageNumber.textContent);
            pageNumber.classList.toggle('active', pageNum === currentPromotionPage);
        });
    }
    
    // Event handlers for pagination buttons
    function handlePageClick(e) {
        if (e.target.classList.contains('page-number')) {
            const pageNum = parseInt(e.target.textContent);
            if (pageNum !== currentPromotionPage) {
                currentPromotionPage = pageNum;
                displayPromotionBooks();
                updatePaginationState();
            }
        } else if (e.target.classList.contains('prev-btn') && currentPromotionPage > 1) {
            currentPromotionPage--;
            displayPromotionBooks();
            updatePaginationState();
        } else if (e.target.classList.contains('next-btn') && currentPromotionPage < totalPages) {
            currentPromotionPage++;
            displayPromotionBooks();
            updatePaginationState();
        }
    }
    
    function createPaginationControls() {
        const paginationHTML = `
            <div class="pagination-container promotion-pagination">
                <button class="pagination-btn prev-btn" ${currentPromotionPage === 1 ? 'disabled' : ''}>Prev</button>
                <div class="page-numbers">
                    ${Array.from({ length: totalPages }, (_, i) => 
                        `<div class="page-number ${i + 1 === currentPromotionPage ? 'active' : ''}">${i + 1}</div>`
                    ).join('')}
                </div>
                <button class="pagination-btn next-btn" ${currentPromotionPage === totalPages ? 'disabled' : ''}>Next</button>
            </div>
        `;
        
        const promotionContainer = document.querySelector('.promotion-container');
        if (promotionContainer) {
            const paginationContainer = document.createElement('div');
            paginationContainer.innerHTML = paginationHTML;
            promotionContainer.after(paginationContainer.firstElementChild);
            
            document.querySelector('.promotion-pagination').addEventListener('click', handlePageClick);
        }
    }
    
    createPaginationControls();
});
// Promotion Books End

// Reccommend Books
document.addEventListener('DOMContentLoaded', function() {
    const recs = document.querySelectorAll('.rec');
    
    recs.forEach(rec => {
        rec.addEventListener('mouseenter', function() {
            const isCenter = this.classList.contains('center');
            
            if (isCenter) {
                this.style.transform = 'translateY(-65px) scale(1.05)';
            } else {
                this.style.transform = 'scale(1.1)';
            }
            
            this.style.filter = 'drop-shadow(0 0 10px rgb(128, 0, 32))';
            this.style.transition = 'all 0.3s ease';
            
            const crown = this.querySelector('.crown img');
            if (crown) {
                crown.style.transform = 'scale(1.1)';
                crown.style.filter = 'brightness(1.2)';
                crown.style.transition = 'all 0.3s ease';
            }
        });
        
        rec.addEventListener('mouseleave', function() {
            if (this.classList.contains('center')) {
                this.style.transform = 'translateY(-50px)';
            } else {
                this.style.transform = 'none';
            }
            
            this.style.filter = 'none';
            
            const crown = this.querySelector('.crown img');
            if (crown) {
                crown.style.transform = 'none';
                crown.style.filter = 'none';
            }
        });
        
        rec.addEventListener('click', function() {
            this.style.transform = this.classList.contains('center') ? 
                'translateY(-50px) scale(0.95)' : 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = this.classList.contains('center') ? 
                    'translateY(-50px)' : 'none';
            }, 150);
            
            });
    });
});
// Reccommend End

//-------- Reccommend Iteraction ---------//

window.onscroll = function() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollPosition = window.scrollY + window.innerHeight; // Current scroll position + viewport height
    const documentHeight = document.documentElement.scrollHeight; // Total height of the document

    if (scrollPosition >= documentHeight - 100) { // Show button if scrolled near the bottom
        scrollUpBtn.classList.add('show');
    } else {
        scrollUpBtn.classList.remove('show');
    }
};

// Scroll to top function
function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

//-------- Reccommend Iteraction End ---------//


//-------- Database Connection ---------//

// src/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
//-------- Database Connection End ---------//
