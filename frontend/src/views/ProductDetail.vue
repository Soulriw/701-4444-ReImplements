<template>
  <div class="product-detail-page">
    <div class="stars"></div>
    
    <div v-if="loading" class="loading-container">
      <h2 style="color: #FEC564;">Loading book details...</h2>
    </div>

    <div v-else-if="!book" class="no-book">
      <div class="no-book-content">
        <i class="fas fa-book fa-3x"></i>
        <h2>Book not found</h2>
        <p>Sorry, this book is not available</p>
        <router-link to="/allProduct" class="back-btn">
          <i class="fas fa-arrow-left"></i> Back to All Products
        </router-link>
      </div>
    </div>

    <div v-else class="product-detail-container">
      <div class="container">
        <div class="row">
          <!-- Book Image -->
          <div class="col-12 col-md-5 col-lg-4">
            <div class="book-image-container">
              <div v-if="hasDiscount(book)" class="discount-badge">
                {{ getDiscountPercentage(book) }}% OFF
              </div>
              <img 
                :src="`/src/model/image/books/${book.bookID}.jpg`" 
                :alt="book.bookName"
                @error="$event.target.src='/src/model/image/books/default.jpg'"
                class="book-image"
              />
            </div>
          </div>

          <!-- Book Details -->
          <div class="col-12 col-md-7 col-lg-8">
            <div class="book-details">
              <h1 class="book-title">{{ book.bookName }}</h1>
              <p class="book-category">{{ book.categoryName }}</p>
              
              <!-- Price Section -->
              <div class="price-section">
                <span v-if="hasDiscount(book)" class="original-price">{{ book.price }} G</span>
                <span class="current-price">{{ getDisplayPrice(book) }} G</span>
                <span v-if="hasDiscount(book)" class="discount-info">Save {{ getDiscountPercentage(book) }}%</span>
              </div>

              <!-- Description -->
              <div class="book-description">
                <h3>Description</h3>
                <p>{{ book.bookDescription || 'No description available for this magical tome.' }}</p>
              </div>

              <!-- Add to Cart -->
              <div class="cart-section">
                <div class="quantity-selector">
                  <label for="quantity">Quantity:</label>
                  <button @click="decreaseQuantity" :disabled="quantity === 1" class="qty-btn">-</button>
                  <input 
                    type="number" 
                    id="quantity"
                    v-model.number="quantity" 
                    min="1"
                    max="99"
                    class="qty-input"
                  />
                  <button @click="increaseQuantity" :disabled="quantity === 99" class="qty-btn">+</button>
                </div>
                
                <div v-if="message" class="message" :class="messageType">
                  {{ message }}
                </div>

                <button @click="addToCart" class="add-to-cart-btn" :disabled="addingToCart">
                  <i class="fas fa-shopping-cart"></i> 
                  <span v-if="addingToCart">Adding to Cart...</span>
                  <span v-else>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Books Section -->
        <div v-if="relatedBooks.length > 0" class="related-books-section">
          <div class="divider"></div>
          <h2 class="section-title">Related Books</h2>
          <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 justify-content-center g-4">
            <div 
              v-for="relatedBook in relatedBooks.slice(0, 5)" 
              :key="relatedBook.bookID" 
              class="col-6 col-lg"
            >
              <BookItem :book="relatedBook" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="back-button" @click="$router.back()">
      <i class="fas fa-arrow-left"></i>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBooksStore } from '../stores'
import axios from 'axios'
import BookItem from '../components/BookItem.vue'

export default {
  name: 'ProductDetail',
  components: {
    BookItem
  },
  setup() {
    const route = useRoute()
    const booksStore = useBooksStore()
    
    const book = ref(null)
    const loading = ref(false)
    const quantity = ref(1)
    const addingToCart = ref(false)
    const message = ref('')
    const messageType = ref('')

    const promotionBooks = computed(() => booksStore.promotionBooks)
    const books = computed(() => booksStore.books)

    const hasDiscount = (book) => {
      return promotionBooks.value.some(promo => promo.bookID === book.bookID)
    }

    const getDiscountPercentage = (book) => {
      const promotionInfo = promotionBooks.value.find(promo => promo.bookID === book.bookID)
      if (promotionInfo) {
        return Math.round((1 - book.proPrice / book.price) * 100)
      }
      return 0
    }

    const getDisplayPrice = (book) => {
      const promotionInfo = promotionBooks.value.find(promo => promo.bookID === book.bookID)
      return promotionInfo ? book.proPrice : book.price
    }

    const relatedBooks = computed(() => {
      if (!book.value) return []
      return books.value
        .filter(b => b.categoryID === book.value.categoryID && b.bookID !== book.value.bookID)
        .slice(0, 5)
    })

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const increaseQuantity = () => {
      if (quantity.value < 99) {
        quantity.value++
      }
    }

    const fetchBook = async () => {
      // Try to get bookId from route params first, then from query
      let bookId = route.params.id
      
      if (!bookId) {
        bookId = route.query.id
      }
      
      console.log('Fetching book with ID:', bookId)
      console.log('Query params:', route.query)
      console.log('Route params:', route.params)
      console.log('Full route:', route)
      
      if (!bookId) {
        console.error('No book ID found in query or params')
        book.value = null
        loading.value = false
        return
      }

      loading.value = true

      try {
        const response = await axios.get(`/api/books/${bookId}`)
        console.log('Book API response:', response.data)
        book.value = response.data
      } catch (error) {
        console.error('Error fetching book:', error)
        console.error('Error response:', error.response)
        book.value = null
      } finally {
        loading.value = false
      }
    }

    const addToCart = async () => {
      if (!book.value) return

      const userStr = localStorage.getItem('user')
      if (!userStr) {
        message.value = 'Please login to add items to cart'
        messageType.value = 'error'
        setTimeout(() => { message.value = '' }, 3000)
        return
      }

      addingToCart.value = true
      message.value = ''

      try {
        const enchantment = hasDiscount(book.value) ? 'Promotion' : 'Standard'

        // Use the correct endpoint
        await axios.post('/api/cart/add', {
          bookID: book.value.bookID,
          quantity: quantity.value,
          enchantment: enchantment
        })

        message.value = 'Item added to cart successfully!'
        messageType.value = 'success'
        
        // Reset quantity after successful add
        quantity.value = 1
      } catch (error) {
        console.error('Error adding to cart:', error)
        message.value = 'Failed to add item to cart'
        messageType.value = 'error'
      } finally {
        addingToCart.value = false
        setTimeout(() => { message.value = '' }, 3000)
      }
    }

    onMounted(async () => {
      try {
        await booksStore.fetchBooks()
        await booksStore.fetchPromotionBooks()
        await fetchBook()
      } catch (error) {
        console.error('Error in onMounted:', error)
      }
    })

    // Watch for route changes to reload book when ID changes
    watch(() => route.params.id, (newId) => {
      if (newId) {
        fetchBook()
      }
    })

    watch(() => route.query.id, (newId) => {
      if (newId) {
        fetchBook()
      }
    })

    return {
      book,
      loading,
      quantity,
      addingToCart,
      message,
      messageType,
      promotionBooks,
      relatedBooks,
      hasDiscount,
      getDiscountPercentage,
      getDisplayPrice,
      decreaseQuantity,
      increaseQuantity,
      addToCart
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  position: relative;
  min-height: 100vh;
  padding-top: 120px;
  padding-bottom: 2rem;
  background-color: #0a0a0a;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}

.stars::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(2px 2px at 20px 30px, #fff, transparent),
              radial-gradient(2px 2px at 40px 70px, #fff, transparent),
              radial-gradient(1px 1px at 90px 40px, #fff, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 20s linear infinite;
}

@keyframes sparkle {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100px);
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.no-book {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.no-book-content {
  text-align: center;
  color: #ccc;
}

.no-book-content i {
  color: #FEC564;
  margin-bottom: 1rem;
}

.no-book-content h2 {
  color: #FEC564;
  margin-bottom: 1rem;
}

.no-book-content p {
  color: #888;
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #FEC564;
  color: #000;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #ffd700;
  transform: translateY(-2px);
}

.product-detail-container {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #0a0a0a;
}

.book-image-container {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  z-index: 10;
}

.discount-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #FEC564;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;
  z-index: 10;
}

.book-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.book-details {
  padding: 0 1rem;
  z-index: 10;
  position: relative;
}

.book-title {
  color: #FEC564;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.book-category {
  color: #ccc;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1.5rem;
}

.current-price {
  color: #FEC564;
  font-size: 2.5rem;
  font-weight: bold;
}

.discount-info {
  background: rgba(254, 197, 100, 0.2);
  color: #FEC564;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.book-description {
  margin-bottom: 2rem;
}

.book-description h3 {
  color: #FEC564;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.book-description p {
  color: #ccc;
  line-height: 1.8;
  font-size: 1.1rem;
}

.cart-section {
  margin-top: 2rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.quantity-selector label {
  color: #FEC564;
  font-weight: bold;
  font-size: 1.1rem;
}

.qty-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: #FEC564;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 80px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  font-weight: bold;
}

.qty-input:focus {
  outline: none;
  border-color: #FEC564;
}

.add-to-cart-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: #FEC564;
  color: #000;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(254, 197, 100, 0.3);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.message.success {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.message.error {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.related-books-section {
  margin-top: 4rem;
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #FEC564, transparent);
  margin: 2rem 0;
}

.section-title {
  color: #FEC564;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.back-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #FEC564;
  color: #000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(254, 197, 100, 0.3);
}

.back-button:hover {
  background: #ffd700;
  transform: translateY(-5px);
}

.back-button i {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .book-title {
    font-size: 2rem;
  }
  
  .current-price {
    font-size: 2rem;
  }
  
  .product-detail-container {
    padding: 0 1rem;
  }
}
</style>

