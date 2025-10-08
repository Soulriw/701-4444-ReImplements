document.addEventListener('DOMContentLoaded', function() {
  let isAddingToCart = false;
  
  const decreaseBtn = document.querySelector('.decrease');
  const increaseBtn = document.querySelector('.increase');
  const quantityInput = document.querySelector('.quantity-input');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const featureCheckboxes = document.querySelectorAll('.feature input[type="checkbox"]');
  const priceElement = document.querySelector('.product-price');
  const productContainer = document.querySelector('.product-container');
  
  // Initialize values
  let promotionBooks = [];
  let book = {};
  const bookId = new URLSearchParams(window.location.search).get('id');

  if (productContainer) {
    try {
      // Extract book data
      if (productContainer.dataset.book) {
        book = JSON.parse(productContainer.dataset.book);
        console.log('Retrieved book data from data attribute');
      }
      
      // Extract promotions data
      if (productContainer.dataset.promotions) {
        promotionBooks = JSON.parse(productContainer.dataset.promotions);
        console.log('Using server-provided promotion data');
        updatePriceDisplay();
      } else {
        fetchPromotionBooks();
      }
    } catch (error) {
      console.error('Error parsing data attributes:', error);
      fetchPromotionBooks();
    }
  } else {
    fetchPromotionBooks();
  }
  
  const debouncedUpdatePrice = debounce(updatePriceDisplay, 100);
  
  async function fetchPromotionBooks() {
    try {
      if ('caches' in window) {
        const cache = await caches.open('book-data');
        const cachedResponse = await cache.match('/api/promotionBooks');
        
        if (cachedResponse) {
          const data = await cachedResponse.json();
          promotionBooks = data;
          debouncedUpdatePrice();
          
          refreshPromotionData(cache);
          return;
        }
      }
      
      const response = await fetch('/api/promotionBooks');
      const data = await response.json();
      
      promotionBooks = data;
      debouncedUpdatePrice();
      
      if ('caches' in window) {
        const cache = await caches.open('book-data');
        cache.put('/api/promotionBooks', new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }
    } catch (error) {
      console.error('Error fetching promotion books:', error);
    }
  }
  
  async function refreshPromotionData(cache) {
    try {
      const freshResponse = await fetch('/api/promotionBooks');
      const freshData = await freshResponse.clone().json();
      
      promotionBooks = freshData;
      debouncedUpdatePrice();
      
      if (cache) {
        cache.put('/api/promotionBooks', freshResponse);
      }
    } catch (error) {
      console.error('Error refreshing promotion data:', error);
    }
  }
  
  function updatePriceDisplay() {
    if (!bookId || !priceElement) return;
    
    const bookElement = document.getElementById('book-data');
    if (!bookElement) return;
    
    const originalPrice = parseFloat(bookElement.dataset.price);
    const proPrice = parseFloat(bookElement.dataset.proPrice || originalPrice);
    
    if (proPrice < originalPrice) {
      const discount = Math.round((1 - proPrice / originalPrice) * 100);
      
      priceElement.innerHTML = `
        <div class="original-price">
          <span style="text-decoration: line-through;">${originalPrice.toFixed(2)}</span>
          <span class="discount-badge">${discount}%</span>
        </div>
        <div class="sale-price">
          <span>${proPrice.toFixed(2)} Galleon</span>
        </div>
      `;
      return;
    }
    
    const promotionInfo = promotionBooks.find(promo => 
      promo.bookID === bookId || 
      parseInt(promo.bookID) === parseInt(bookId)
    );
    
    if (promotionInfo && parseFloat(promotionInfo.proPrice) < originalPrice) {
      const discount = Math.round((1 - promotionInfo.proPrice / originalPrice) * 100);
      
      priceElement.innerHTML = `
        <div class="original-price">
          <span style="text-decoration: line-through;">${originalPrice.toFixed(2)}</span>
          <span class="discount-badge">${discount}%</span>
        </div>
        <div class="sale-price">
          <span>${promotionInfo.proPrice} Galleon</span>
        </div>
      `;
    } else {
      priceElement.innerHTML = `
        <div class="sale-price">
          <span>${originalPrice.toFixed(2)} Galleon</span>
        </div>
      `;
    }
  }
  
  // Quantity selector event listeners
  decreaseBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
      quantityInput.value = value - 1;
    }
  });
  
  increaseBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value);
    quantityInput.value = value + 1;
  });

  // Single feature selection functionality
  featureCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if(this.checked) {
        // Uncheck all other checkboxes
        featureCheckboxes.forEach(otherCheckbox => {
          if(otherCheckbox !== this) {
            otherCheckbox.checked = false;
          }
        });
      }
    });
  });

  // Optimization: Add to Cart with improved error handling and UX feedback
  addToCartBtn.addEventListener('click', async function() {
    // Prevent multiple simultaneous requests
    if (isAddingToCart || this.disabled) return;
    
    isAddingToCart = true;
    
    // Disable the button temporarily while processing
    this.disabled = true;
    const originalText = this.textContent;
    this.textContent = 'Adding to cart...';
    
    try {
        if (!bookId) {
            throw new Error('Book ID not found');
        }
        
        // Get selected feature
        const selectedFeature = Array.from(featureCheckboxes)
            .find(checkbox => checkbox.checked)?.nextElementSibling.textContent.trim() || '';
        
        // Get quantity
        const quantity = parseInt(quantityInput.value);
        
        // Send data to the server
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bookID: bookId,
                quantity: quantity,
                enchantment: selectedFeature
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add to cart');
        }
        
        const result = await response.json();
        
        // Update button to show success
        this.textContent = 'Already in cart';
        this.classList.add('in-cart');
        
        // Keep the button disabled
        this.disabled = true;
        
        // MODIFY HERE: Add this code to update the cart counter
        // Notify about cart update
        document.dispatchEvent(new Event('cartUpdated'));
        localStorage.setItem('cartUpdated', Date.now());
        
        // If window.refreshCartCount exists, call it
        if (typeof window.refreshCartCount === 'function') {
            window.refreshCartCount();
        }
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        
        // Re-enable the button if there's an error
        this.disabled = false;
        this.textContent = originalText;
        
        // Show an error message to the user
        alert('Could not add to cart: ' + error.message);
    } finally {
        // Reset the flag after a delay to prevent rapid clicking
        setTimeout(() => {
            isAddingToCart = false;
        }, 1000);
    }
});

  // Check if book is already in cart
  // Optimization: Use the pre-loaded information if available from server
  function checkCartStatus() {
    // If server has provided cart status in the HTML
    const bookData = document.getElementById('book-data');
    if (bookData && bookData.dataset.inCart === 'true') {
      const cartQuantity = parseInt(bookData.dataset.cartQuantity || '1');
      const cartEnchantment = bookData.dataset.cartEnchantment || '';
      
      // Update button state
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Already in cart';
      addToCartBtn.classList.add('in-cart');
      
      // Update quantity and feature selection
      quantityInput.value = cartQuantity;
      
      // Check the corresponding feature if it was selected
      if (cartEnchantment) {
        featureCheckboxes.forEach(checkbox => {
          const label = checkbox.nextElementSibling.textContent.trim();
          checkbox.checked = (label === cartEnchantment);
        });
      }
      
      return; // Skip the API call
    }
    
    // Fallback to API call if cart info wasn't provided by server
    fetchCartStatus();
  }
  
  async function fetchCartStatus() {
    if (!bookId) return;
    
    try {
      const response = await fetch(`/api/cart/check?bookID=${bookId}`);
      const result = await response.json();
      
      if (result.inCart) {
        // Book is already in cart, update button
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Already in cart';
        addToCartBtn.classList.add('in-cart');
        
        // Set quantity if available
        if (result.item && result.item.quantity) {
          quantityInput.value = result.item.quantity;
        }
        
        // Check the corresponding feature if it was selected
        if (result.item && result.item.enchantment) {
          featureCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent.trim();
            checkbox.checked = (label === result.item.enchantment);
          });
        }
      }
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  }
  
  // Helper: Debounce function to prevent excessive function calls
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // Initialize page with cart status
  if (book && book.inCart) {
    // Server has already provided cart info in the page
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = 'Already in cart';
    addToCartBtn.classList.add('in-cart');
    
    if (book.cartInfo) {
      // Set quantity if available
      quantityInput.value = book.cartInfo.quantity || 1;
      
      // Check the corresponding feature if it was selected
      if (book.cartInfo.enchantment) {
        featureCheckboxes.forEach(checkbox => {
          const label = checkbox.nextElementSibling.textContent.trim();
          checkbox.checked = (label === book.cartInfo.enchantment);
        });
      }
    }
  } else {
    // Check cart status using API
    checkCartStatus();
  }
});