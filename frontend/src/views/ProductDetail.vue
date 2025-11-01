<template>
  <div class="relative min-h-screen pt-[120px] pb-8 bg-dark">
    <div class="fixed inset-0 pointer-events-none z-0 bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #fff, transparent), radial-gradient(2px 2px at 40px 70px, #fff, transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent); background-repeat: repeat; background-size: 200px 100px; animation: sparkle 20s linear infinite;"></div>
    
    <div v-if="loading" class="flex justify-center items-center min-h-[80vh] relative z-10">
      <h2 class="text-gold">Loading book details...</h2>
    </div>

    <div v-else-if="!book" class="flex justify-center items-center min-h-[80vh] relative z-10">
      <div class="text-center text-gray-300">
        <i class="fas fa-book fa-3x text-gold mb-4"></i>
        <h2 class="text-gold mb-4">Book not found</h2>
        <p class="text-gray-400 mb-8">Sorry, this book is not available</p>
        <router-link to="/allProduct" class="inline-block px-6 py-3 bg-gold text-black rounded font-bold transition-all duration-300 hover:bg-[#ffd700] hover:-translate-y-0.5">
          <i class="fas fa-arrow-left"></i> Back to All Products
        </router-link>
      </div>
    </div>

    <div v-else class="relative z-10 max-w-[1200px] mx-auto bg-dark px-4">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Book Image -->
        <div class="w-full md:w-2/5 lg:w-1/3">
          <div class="relative bg-white/5 border border-white/10 rounded-[15px] p-8 mb-8 text-center z-10">
            <div v-if="hasDiscount(book)" class="absolute top-5 right-5 bg-gold text-black px-4 py-2 rounded-[20px] font-bold z-10">
              {{ getDiscountPercentage(book) }}% OFF
            </div>
            <img 
              :src="`/src/model/image/books/${book.bookID}.jpg`" 
              :alt="book.bookName"
              class="w-full max-w-[400px] h-auto rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] mx-auto"
              @error="$event.target.src='/src/model/image/books/default.jpg'"
            />
          </div>
        </div>

        <!-- Book Details -->
        <div class="w-full md:w-3/5 lg:w-2/3">
          <div class="px-4 z-10 relative">
            <h1 class="text-gold text-4xl mb-2 font-bold max-md:text-3xl">{{ book.bookName }}</h1>
            <p class="text-gray-300 text-xl mb-8">{{ book.categoryName }}</p>
            
            <!-- Price Section -->
            <div class="flex items-center gap-4 mb-8 py-4 border-t border-b border-white/10">
              <span v-if="hasDiscount(book)" class="text-gray-400 line-through text-2xl">{{ book.price }} G</span>
              <span class="text-gold text-4xl font-bold max-md:text-3xl">{{ getDisplayPrice(book) }} G</span>
              <span v-if="hasDiscount(book)" class="bg-gold/20 text-gold px-4 py-2 rounded-[20px] text-sm">Save {{ getDiscountPercentage(book) }}%</span>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <h3 class="text-gold mb-4 text-2xl">Description</h3>
              <p class="text-gray-300 leading-relaxed text-lg">{{ book.bookDescription || 'No description available for this magical tome.' }}</p>
            </div>

            <!-- Add to Cart -->
            <div class="mt-8">
              <div class="flex items-center gap-4 mb-6">
                <label for="quantity" class="text-gold font-bold text-lg">Quantity:</label>
                <button @click="decreaseQuantity" :disabled="quantity === 1" class="w-10 h-10 bg-white/10 border border-white/20 rounded text-white cursor-pointer text-xl transition-all duration-300 hover:bg-white/20 hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                <input 
                  type="number" 
                  id="quantity"
                  v-model.number="quantity" 
                  min="1"
                  max="99"
                  class="w-20 px-2 py-2 bg-white/10 border border-white/20 rounded text-white text-xl text-center font-bold focus:outline-none focus:border-gold"
                />
                <button @click="increaseQuantity" :disabled="quantity === 99" class="w-10 h-10 bg-white/10 border border-white/20 rounded text-white cursor-pointer text-xl transition-all duration-300 hover:bg-white/20 hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed">+</button>
              </div>
              
              <div 
                v-if="message" 
                class="p-4 rounded mb-4 text-center font-bold"
                :class="{
                  'bg-green/20 text-green border border-green/30': messageType === 'success',
                  'bg-red/20 text-[#ff4444] border border-red/30': messageType === 'error'
                }"
              >
                {{ message }}
              </div>

              <button 
                @click="addToCart" 
                class="w-full px-8 py-4 bg-gold text-black border-none rounded flex items-center justify-center gap-2 text-xl font-bold cursor-pointer transition-all duration-300 hover:bg-[#ffd700] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(254,197,100,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="addingToCart"
              >
                <i class="fas fa-shopping-cart"></i> 
                <span v-if="addingToCart">Adding to Cart...</span>
                <span v-else>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Books Section -->
      <div v-if="relatedBooks.length > 0" class="mt-16">
        <div class="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent my-8"></div>
        <h2 class="text-gold text-3xl text-center mb-8">Related Books</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
          <div 
            v-for="relatedBook in relatedBooks.slice(0, 5)" 
            :key="relatedBook.bookID" 
            class="w-full"
          >
            <BookItem :book="relatedBook" />
          </div>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="fixed bottom-[30px] right-[30px] bg-gold text-black w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-[100] shadow-[0_5px_15px_rgba(254,197,100,0.3)] hover:bg-[#ffd700] hover:-translate-y-1" @click="$router.back()">
      <i class="fas fa-arrow-left text-2xl"></i>
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
@keyframes sparkle {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100px);
  }
}
</style>
