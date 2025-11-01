<template>
  <div class="py-8 min-h-[80vh] pt-[120px]">
    <div class="container mx-auto px-4">
      <div class="w-full">
        <h1 class="text-gold text-4xl mb-8 text-center">Shopping Cart</h1>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <h2 class="text-gold">Loading cart...</h2>
      </div>

      <div v-else-if="cartItems.length === 0" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center text-gray-300">
          <i class="fas fa-shopping-cart fa-3x text-gold mb-4"></i>
          <h2 class="text-gold mb-4">Your cart is empty</h2>
          <p class="mb-8">Add some magical books to get started!</p>
          <router-link to="/allProduct" class="inline-block px-6 py-3 bg-gold text-black rounded-lg font-bold hover:bg-[#ffd700] transition-colors">
            Browse Books
          </router-link>
        </div>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Cart Items -->
        <div class="lg:w-2/3">
          <div class="space-y-4">
            <div 
              v-for="item in cartItems" 
              :key="item.cartID" 
              class="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-[10px] max-md:flex-col max-md:text-center"
            >
              <div class="flex-shrink-0">
                <input 
                  type="checkbox" 
                  :id="`item-${item.cartID}`"
                  v-model="selectedItems"
                  :value="item.cartID"
                  class="w-5 h-5 accent-gold"
                />
                <label :for="`item-${item.cartID}`" class="sr-only"></label>
              </div>

              <div class="flex-shrink-0">
                <img 
                  :src="`/src/model/image/books/${item.cartBookID}.jpg`" 
                  :alt="item.bookName"
                  class="w-20 h-30 object-cover rounded max-md:w-[120px] max-md:h-[180px]"
                  @error="$event.target.src='/src/model/image/books/default.jpg'"
                />
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-gold mb-2 text-xl font-bold">{{ item.bookName }}</h3>
                <p class="text-gray-400 text-sm mb-2">{{ item.categoryName }}</p>
                <p class="text-gray-300 text-sm mb-2 line-clamp-2">{{ item.bookDescription }}</p>
                
                <div v-if="item.enchantment" class="mb-2">
                  <span class="text-gray-400 text-xs">Enchantment:</span>
                  <span class="text-gold font-bold ml-2">{{ item.enchantment }}</span>
                </div>

                <div class="mb-2">
                  <span class="text-gray-400 text-xs">Quantity:</span>
                  <span class="text-white font-bold ml-2">{{ item.quantity }}</span>
                </div>
              </div>

              <div class="text-right flex-shrink-0 max-md:text-center">
                <div v-if="item.isPromotionBook && item.hasDiscount" class="mb-2">
                  <span class="text-gray-400 line-through text-sm block">{{ item.price }} G</span>
                  <span class="text-gold font-bold text-lg">{{ item.proPrice }} G</span>
                  <div class="bg-[#ff4444] text-white px-2 py-1 rounded-[10px] text-xs font-bold mt-1 inline-block">{{ item.discountPercentage }}% OFF</div>
                </div>
                <div v-else class="mb-2">
                  <span class="text-gold font-bold text-lg">{{ item.price }} G</span>
                </div>
                
                <div class="text-white font-bold">
                  Total: {{ (item.isPromotionBook ? item.proPrice : item.price) * item.quantity }} G
                </div>
              </div>

              <div class="flex-shrink-0">
                <button 
                  @click="removeItem(item.cartID)" 
                  class="bg-[#ff4444] text-white border-none rounded px-2 py-2 cursor-pointer transition-all duration-300 hover:bg-[#ff6666] hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="removing"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="lg:w-1/3">
          <div class="bg-white/5 border border-white/10 rounded-[10px] p-8 sticky top-8">
            <h3 class="text-gold mb-6 text-center text-xl">Order Summary</h3>
            
            <div class="flex justify-between mb-4 text-gray-300">
              <span>Items ({{ selectedItemsCount }}):</span>
              <span>{{ selectedTotalPrice }} G</span>
            </div>
            
            <div class="flex justify-between mb-8 text-gold font-bold text-xl border-t border-white/10 pt-4">
              <span>Total:</span>
              <span>{{ selectedTotalPrice }} G</span>
            </div>

            <button 
              @click="checkout" 
              :disabled="selectedItemsCount === 0 || checkingOut"
              class="w-full px-8 py-4 bg-gold text-black border-none rounded-[10px] text-xl font-bold cursor-pointer transition-all duration-300 mb-4 hover:bg-[#ffd700] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(254,197,100,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="checkingOut">Processing...</span>
              <span v-else>Checkout</span>
            </button>

            <div 
              v-if="checkoutMessage" 
              class="p-4 rounded-md text-center font-bold"
              :class="{
                'bg-green/20 text-green border border-green/30': checkoutMessageType === 'success',
                'bg-red/20 text-[#ff4444] border border-red/30': checkoutMessageType === 'error'
              }"
            >
              {{ checkoutMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores'

export default {
  name: 'Cart',
  setup() {
    const cartStore = useCartStore()
    
    const cartItems = ref([])
    const selectedItems = ref([])
    const loading = ref(true)
    const removing = ref(false)
    const checkingOut = ref(false)
    const checkoutMessage = ref('')
    const checkoutMessageType = ref('')

    const selectedItemsCount = computed(() => {
      return selectedItems.value.length
    })

    const selectedTotalPrice = computed(() => {
      return cartItems.value
        .filter(item => selectedItems.value.includes(item.cartID))
        .reduce((total, item) => {
          const price = item.isPromotionBook ? item.proPrice : item.price
          return total + (price * item.quantity)
        }, 0)
    })

    const fetchCartItems = async () => {
      try {
        await cartStore.fetchCartItems()
        cartItems.value = cartStore.items
        
        // Process promotion information
        cartItems.value.forEach(item => {
          const promotionInfo = cartStore.promotionBooks.find(promo => 
            String(promo.bookID) === String(item.cartBookID)
          )
          
          if (promotionInfo) {
            item.isPromotionBook = true
            item.proPrice = promotionInfo.proPrice
            item.hasDiscount = parseFloat(promotionInfo.proPrice) < parseFloat(item.price)
            
            if (item.hasDiscount) {
              item.discountPercentage = Math.round((1 - (promotionInfo.proPrice / item.price)) * 100)
            }
          } else {
            item.isPromotionBook = false
            item.proPrice = item.price
            item.hasDiscount = false
          }
        })
      } catch (error) {
        console.error('Error fetching cart items:', error)
      } finally {
        loading.value = false
      }
    }

    const removeItem = async (cartId) => {
      removing.value = true
      try {
        const result = await cartStore.removeFromCart(cartId)
        if (result.success) {
          await fetchCartItems()
          // Remove from selected items if it was selected
          const index = selectedItems.value.indexOf(cartId)
          if (index > -1) {
            selectedItems.value.splice(index, 1)
          }
        }
      } catch (error) {
        console.error('Error removing item:', error)
      } finally {
        removing.value = false
      }
    }

    const checkout = async () => {
      if (selectedItems.value.length === 0) return
      
      checkingOut.value = true
      checkoutMessage.value = ''
      
      try {
        const result = await cartStore.checkout(selectedItems.value)
        if (result.success) {
          checkoutMessage.value = 'Checkout completed successfully!'
          checkoutMessageType.value = 'success'
          selectedItems.value = []
          await fetchCartItems()
        } else {
          checkoutMessage.value = result.error || 'Checkout failed'
          checkoutMessageType.value = 'error'
        }
      } catch (error) {
        checkoutMessage.value = 'An error occurred during checkout'
        checkoutMessageType.value = 'error'
      } finally {
        checkingOut.value = false
        
        // Clear message after 5 seconds
        setTimeout(() => {
          checkoutMessage.value = ''
        }, 5000)
      }
    }

    onMounted(() => {
      fetchCartItems()
    })

    return {
      cartItems,
      selectedItems,
      loading,
      removing,
      checkingOut,
      checkoutMessage,
      checkoutMessageType,
      selectedItemsCount,
      selectedTotalPrice,
      removeItem,
      checkout
    }
  }
}
</script>
