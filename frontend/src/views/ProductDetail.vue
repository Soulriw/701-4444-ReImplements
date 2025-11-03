<template>
  <div class="relative min-h-screen pt-10 pb-8" style="background: linear-gradient(180deg, #2D1A47 0%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    <!-- Stars background animation layer -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #FEC564, transparent), radial-gradient(2px 2px at 40px 70px, #FEC564, transparent), radial-gradient(1px 1px at 90px 40px, #FEC564, transparent), radial-gradient(1px 1px at 130px 80px, #FEC564, transparent), radial-gradient(2px 2px at 160px 30px, #FEC564, transparent); background-size: 200px 100px;"></div>
    
    <div v-if="loading" class="flex justify-center items-center min-h-[80vh] relative z-10">
      <h2 class="text-gold">Loading book details...</h2>
    </div>

    <div v-else-if="!book" class="flex justify-center items-center min-h-[80vh] relative z-10">
      <div class="text-center text-gray-300">
        <i class="fas fa-book fa-3x text-gold mb-4"></i>
      </div>
    </div>

    <div v-else class="relative z-10">
      <!-- Product Container -->
      <div class="max-w-[900px] mx-auto max-[1024px]:max-w-[90%] max-md:my-20 max-md:p-[15px] max-[440px]:my-5 max-[440px]:p-[10px]">
        <!-- Product Detail Section -->
        <div class="flex gap-10 mb-[30px] max-md:flex-col max-md:items-center max-md:gap-[30px] max-[440px]:gap-[15px] max-[440px]:mb-[15px]">
          <!-- Product Image -->
          <div class="flex-1 w-full h-auto -ml-[50px] bg-transparent max-md:ml-0 max-md:mt-[100px] max-[440px]:max-w-[75%] max-[440px]:mt-0">
            <img 
              :src="`/src/model/image/books/${book.bookID}.jpg`" 
              :alt="book.bookName"
              class="w-full h-auto block border-[4px] border-[#FFD700] max-[440px]:border-2"
              @error="$event.target.src='/src/model/image/books/default.jpg'"
            />
          </div>

          <!-- Product Info -->
          <div class="flex-1 flex flex-col justify-center gap-[10px] text-white max-md:w-full max-md:items-center">
            <!-- Product Title -->
            <h1 class="text-[50px] -mr-[200px] text-[#FEC564] max-[1024px]:text-[40px] max-[1024px]:-mr-[50px] max-md:text-[35px] max-md:mr-0 max-md:text-center max-[440px]:text-[22px] max-[440px]:mb-[5px]">
              {{ book.bookName }}
            </h1>

            <!-- Product Info Column (Price/Quantity and Features) -->
            <div class="flex gap-10 mb-5 max-md:flex-row max-md:justify-between max-md:items-center max-md:gap-[70px] max-md:mb-[15px] max-[440px]:gap-[50px] max-[440px]:mb-[5px]">
              <!-- Left Column (Price and Quantity) -->
              <div class="flex flex-col max-[440px]:flex-col">
                <!-- Product Price -->
                <div class="mb-[10px] max-md:text-center max-[440px]:mb-0">
                  <div v-if="hasDiscount(book)" class="text-[25px] text-[#999] relative no-underline flex items-center justify-center mt-[25px] max-[440px]:text-[16px] max-[440px]:mt-0">
                    <span class="line-through">{{ book.price }} G</span>
                    <span class="bg-[#ff0000] text-white text-base py-[1px] px-[10px] rounded-[20px] ml-[10px] inline-block max-[440px]:text-xs max-[440px]:py-[1px] max-[440px]:px-2">{{ getDiscountPercentage(book) }}% OFF</span>
                  </div>
                  <div class="text-[30px] mb-[10px] text-[#FEC564] max-md:text-center max-[440px]:text-[22px] max-[440px]:-ml-5">
                    <span class="text-[2.5rem] text-[#FEC564] max-[440px]:text-[22px]">{{ getDisplayPrice(book) }} G</span>
                  </div>
                </div>

                <!-- Quantity Selector -->
                <div class="text-black flex items-center justify-center mb-5 w-[150px] ml-12 max-md:ml-[35px] max-[440px]:m-0 max-[440px]:w-[90px]">
                  <button 
                    @click="decreaseQuantity" 
                    :disabled="quantity === 1"
                    class="w-10 h-10 bg-white border-none rounded-[2px] font-bold text-black text-[30px] cursor-pointer flex items-center justify-center max-[440px]:w-[25px] max-[440px]:h-[25px] max-[440px]:text-[18px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="quantity"
                    v-model.number="quantity" 
                    min="1"
                    max="99"
                    class="w-[50px] h-10 border-none border-l border-r border-[#eee] bg-white font-bold text-center text-[32px] max-[440px]:w-[30px] max-[440px]:h-[25px] max-[440px]:text-[18px]"
                  />
                  <button 
                    @click="increaseQuantity" 
                    :disabled="quantity === 99"
                    class="w-10 h-10 bg-white border-none rounded-[2px] font-bold text-black text-[30px] cursor-pointer flex items-center justify-center max-[440px]:w-[25px] max-[440px]:h-[25px] max-[440px]:text-[18px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Right Column (Product Features) -->
              <div class="flex flex-col gap-[30px] mb-5 -mr-[100px] mt-5 max-[1024px]:-mr-[50px] max-md:mr-0 max-[440px]:m-0 max-[440px]:gap-[10px]">
                <div v-for="(feature, index) in features" :key="index" class="flex items-start gap-5 text-[23px] max-[440px]:text-base max-[440px]:gap-2">
                  <input 
                    type="checkbox" 
                    :id="`feature-${index}`"
                    :checked="selectedFeatures.includes(feature.value)"
                    @change="handleFeatureChange(feature.value, $event)"
                    class="w-[35px] h-[35px] appearance-none bg-white border-2 border-black relative cursor-pointer rounded-[5px] checked:bg-white checked:border-black max-[440px]:w-[18px] max-[440px]:h-[18px]"
                  />
                  <label :for="`feature-${index}`" class="cursor-pointer text-white">{{ feature.label }}</label>
                </div>
              </div>
            </div>

            <!-- Message -->
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

            <!-- Add to Cart Button -->
            <button 
              @click="addToCart" 
              class="bg-[#FEC564] text-black border-none text-[32px] font-bold font-['Irish_Grover'] cursor-pointer rounded-[20px] text-center justify-center h-[55px] w-full max-w-[350px] ml-20 transition-colors duration-300 hover:bg-[#fa9e00] disabled:bg-[#cccccc] disabled:cursor-not-allowed disabled:text-[#666666] max-[1024px]:ml-10 max-md:ml-0 max-[440px]:text-[18px] max-[440px]:h-10 max-[440px]:max-w-[50%] max-[440px]:mt-[10px]"
              :disabled="addingToCart"
            >
              <span v-if="addingToCart">Adding to Cart...</span>
              <span v-else>Add to Cart</span>
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="max-w-[2000px] h-[3px] bg-[#FEC564] mt-10 relative -left-[15%] w-[130%] max-[1024px]:-left-[10%] max-[1024px]:w-[120%] max-md:left-0 max-md:w-full max-md:mt-5 max-md:mb-5 max-[440px]:left-0 max-[440px]:w-full max-[440px]:mt-5 max-[440px]:mb-5"></div>

        <!-- Product Description Container -->
        <div class="max-w-[1200px] -ml-[100px] -mr-[100px] p-5 text-[#FEC564] max-[1024px]:-ml-[50px] max-[1024px]:-mr-[50px] max-md:ml-0 max-md:mr-0 max-md:text-center max-[440px]:p-[10px] max-[440px]:text-left">
          <h2 class="text-[2.5rem] -mt-[10px] mb-5 max-md:text-[2rem] max-[440px]:text-[20px] max-[440px]:mb-[10px]">Description</h2>
          <p class="text-[1.8rem] leading-[1.6] m-0 max-md:text-[1.5rem] max-[440px]:text-base max-[440px]:leading-[1.4] max-[440px]:text-justify">
            {{ book.bookDescription || 'No description available for this magical tome.' }}
          </p>
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
    const selectedFeatures = ref([])

    const promotionBooks = computed(() => booksStore.promotionBooks)
    const books = computed(() => booksStore.books)

    const hasDiscount = (book) => {
      return promotionBooks.value.some(promo => promo.bookID === book.bookID)
    }
    
    const features = computed(() => {
      return [
        { label: 'Fire Resistant', value: 'Fire Resistant' },
        { label: 'Self Repairing', value: 'Self Repairing' },
        { label: 'Magical Lock', value: 'Magical Lock' }
      ]
    })

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

    const handleFeatureChange = (featureValue, event) => {
      if (event.target.checked) {
        // Only allow one feature to be selected (radio-like behavior)
        selectedFeatures.value = [featureValue]
      } else {
        // If unchecking, ensure at least one is selected
        if (selectedFeatures.value.length === 1) {
          event.target.checked = true
          return
        }
        selectedFeatures.value = selectedFeatures.value.filter(v => v !== featureValue)
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
        // Use selected feature or default to Fire Resistant
        const enchantment = selectedFeatures.value.length > 0 
          ? selectedFeatures.value[0] 
          : 'Fire Resistant'

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
    
    // Watch book changes to set default feature
    watch(() => book.value, (newBook) => {
      if (newBook) {
        selectedFeatures.value = ['Fire Resistant']
      }
    }, { immediate: true })

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
      addToCart,
      features,
      selectedFeatures,
      handleFeatureChange
    }
  }
}
</script>

<style scoped>
/* Stars animation is now handled in template */

/* Checkbox checked state styling */
input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: #000000;
  font-size: 28px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Checkbox styling */
input[type="checkbox"] {
  border: 2px solid #000000 !important;
  background-color: #ffffff !important;
}

input[type="checkbox"]:checked {
  background-color: #ffffff !important;
  border-color: #000000 !important;
}

@media screen and (max-width: 440px) {
  input[type="checkbox"]:checked::after {
    font-size: 14px;
  }
}
</style>
