<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 0%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Stars background animation layer -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #FEC564, transparent), radial-gradient(2px 2px at 40px 70px, #FEC564, transparent), radial-gradient(1px 1px at 90px 40px, #FEC564, transparent), radial-gradient(1px 1px at 130px 80px, #FEC564, transparent), radial-gradient(2px 2px at 160px 30px, #FEC564, transparent); background-size: 200px 100px;"></div>
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500] min-h-[80vh]">
    <div class="max-w-[1200px] pt-20 mx-auto px-[20px] lg:max-w-[900px] md:max-w-[700px] max-[440px]:px-[10px] max-[440px]:my-[20px]">
      <h1 class="text-[#FEC564] text-center text-[48px] mb-[20px] lg:text-[40px] md:text-[36px] max-[440px]:text-[28px] max-[440px]:mb-[10px] max-[375px]:text-[24px]">Shopping Cart</h1>

      <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <h2 class="text-[#FEC564]">Loading cart...</h2>
      </div>

      <div v-else-if="cartItems.length === 0" class="text-center py-[50px]">
        <h2 class="text-[#FEC564] text-[32px] mb-[20px]">Your cart is empty</h2>
        <p class="text-white text-[18px] mb-[30px]">Add some magical books to get started!</p>
        <router-link 
          to="/allProduct" 
          id="continue-shopping"
          class="bg-[#432667] text-white border-none py-[10px] px-[20px] rounded-[20px] cursor-pointer text-[18px] font-['Irish Grover'] transition-colors hover:bg-[#693467]"
        >
          Browse Books
        </router-link>
      </div>

      <div v-else>
        <!-- Cart Actions -->
        <div class="flex justify-between items-center mt-[20px] mb-[40px] max-[440px]:mt-[10px] max-[440px]:mb-[20px]">
          <div class="flex items-center gap-[10px] text-[#FEC564] text-[18px] max-[440px]:text-[16px] max-[375px]:text-[14px]">
            <input 
              type="checkbox" 
              id="select-all"
              :checked="selectedItems.length === cartItems.length && cartItems.length > 0"
              @change="toggleSelectAll"
              class="w-[20px] h-[20px] cursor-pointer"
            />
            <label for="select-all" class="cursor-pointer">Select All</label>
          </div>
          <router-link 
            to="/allProduct"
            id="continue-shopping"
            class="bg-[#432667] text-white border-none py-[10px] px-[20px] rounded-[20px] cursor-pointer text-[18px] font-['Irish Grover'] transition-colors hover:bg-[#693467] max-[440px]:py-[8px] max-[440px]:px-[15px] max-[440px]:text-[16px] max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[14px]"
          >
            Continue Shopping
          </router-link>
        </div>

        <!-- Divider -->
        <div class="w-full h-[2px] bg-[#fec564] my-[20px] max-[440px]:my-[10px]"></div>

        <!-- Cart Items -->
        <div class="space-y-0">
          <div 
            v-for="item in cartItems" 
            :key="item.cartID" 
            class="flex items-center py-[20px] relative max-[440px]:py-[10px]"
          >
            <div class="flex-[0_0_50px] flex justify-center max-[440px]:flex-[0_0_30px]">
              <input 
                type="checkbox" 
                :id="`item-${item.cartID}`"
                v-model="selectedItems"
                :value="item.cartID"
                class="w-[20px] h-[20px] cursor-pointer"
              />
              <label :for="`item-${item.cartID}`" class="sr-only"></label>
            </div>

            <div class="flex-1 flex items-center">
              <div class="w-[120px] h-[150px] mr-[20px] lg:w-[120px] lg:h-[150px] md:w-[100px] md:h-[120px] max-md:w-[80px] max-md:h-[100px] max-[440px]:w-[60px] max-[440px]:h-[80px] max-[440px]:mr-[10px] max-[375px]:w-[50px] max-[375px]:h-[70px]">
                <img 
                  :src="`/src/model/image/books/${item.cartBookID}.jpg`" 
                  :alt="item.bookName"
                  class="w-full h-full object-cover rounded-[8px]"
                  @error="$event.target.src='/src/model/image/books/default.jpg'"
                />
              </div>

              <div class="flex-1">
                <h3 class="text-[#FEC564] text-[24px] mb-[10px] lg:text-[24px] md:text-[24px] max-md:text-[20px] max-[440px]:text-[16px] max-[440px]:mb-[5px] max-[375px]:text-[14px]">{{ item.bookName }}</h3>
                
                <div class="flex items-center gap-[10px] mb-[10px] max-[440px]:mb-[5px]">
                  <span v-if="item.isPromotionBook && item.hasDiscount" class="text-[#999] line-through">{{ item.price }} G</span>
                  <span :class="item.isPromotionBook && item.hasDiscount ? 'text-[#FEC564] font-bold text-[18px] lg:text-[18px] md:text-[18px] max-md:text-[16px] max-[440px]:text-[14px] max-[375px]:text-[12px]' : 'text-[#FEC564] font-bold text-[18px]'">{{ item.isPromotionBook && item.hasDiscount ? item.proPrice : item.price }} G</span>
                </div>

                <div v-if="item.enchantment" class="text-white text-[14px] mb-[10px]">
                  Enchantment: {{ item.enchantment }}
                </div>
              </div>
            </div>

            <div class="flex-[0_0_80px] flex justify-center text-[#FEC564] text-[20px] font-bold lg:text-[20px] md:text-[20px] max-md:text-[20px] max-[440px]:text-[16px] max-[440px]:mr-[10px] max-[375px]:text-[14px]">
              {{ item.quantity }}
            </div>

            <div class="flex-[0_0_100px] flex justify-center">
              <button 
                @click="removeItem(item.cartID)" 
                class="bg-[#8B4365] text-white border-none py-[8px] px-[16px] rounded-[20px] cursor-pointer font-['Irish Grover'] transition-colors hover:bg-[#B65C56] disabled:opacity-60 disabled:cursor-not-allowed lg:py-[8px] lg:px-[16px] md:py-[7px] md:px-[14px] max-md:py-[6px] max-md:px-[12px] max-md:text-[14px] max-[440px]:py-[5px] max-[440px]:px-[10px] max-[440px]:text-[12px] max-[375px]:py-[4px] max-[375px]:px-[8px] max-[375px]:text-[11px]"
                :disabled="removing"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full h-[2px] bg-[#fec564] my-[20px]"></div>

        <!-- Cart Summary -->
        <div class="bg-white rounded-[20px] p-[30px] flex flex-col items-center mt-[20px] max-md:p-[20px] max-md:rounded-[0] max-md:rounded-t-[20px] max-md:w-full max-[440px]:p-[15px] max-[440px]:mt-[10px]">
          <div class="w-full text-center mb-[20px]">
            <h2 class="text-[#2D1A47] text-[32px] flex justify-between gap-[20px] lg:text-[32px] md:text-[32px] max-md:text-[24px] max-[440px]:text-[18px] max-[375px]:text-[16px]">
              <span>Total:</span>
              <span id="total-amount" class="font-bold">{{ selectedTotalPrice }} G</span>
            </h2>
          </div>

          <button 
            @click="checkout" 
            id="purchase-btn"
            :disabled="selectedItemsCount === 0 || checkingOut"
            class="bg-[#FEC564] text-[#2D1A47] border-none py-[15px] px-[60px] rounded-[30px] cursor-pointer font-['Irish Grover'] text-[24px] font-bold transition-colors hover:bg-[#ffb63a] disabled:opacity-60 disabled:cursor-not-allowed lg:py-[15px] lg:px-[60px] lg:text-[24px] md:py-[12px] md:px-[50px] md:text-[22px] max-md:py-[12px] max-md:px-[40px] max-md:text-[20px] max-[440px]:py-[10px] max-[440px]:px-[30px] max-[440px]:text-[16px] max-[375px]:py-[8px] max-[375px]:px-[25px] max-[375px]:text-[14px]"
          >
            <span v-if="checkingOut">Processing...</span>
            <span v-else>Checkout</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Notification Popup -->
    <teleport to="body">
      <transition name="alert-slide">
        <div 
          v-if="checkoutMessage" 
          class="fixed top-[20px] left-1/2 -translate-x-1/2 z-[9999] min-w-[300px] max-w-[500px] p-[20px] rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-center font-bold text-[18px] backdrop-blur-sm max-[440px]:min-w-[280px] max-[440px]:p-[15px] max-[440px]:text-[16px] max-[440px]:top-[10px]"
          :class="{
            'bg-green-500/90 text-white border-2 border-green-600': checkoutMessageType === 'success',
            'bg-red-500/90 text-white border-2 border-red-600': checkoutMessageType === 'error'
          }"
        >
          <div class="flex items-center justify-center gap-[10px]">
            <i 
              :class="checkoutMessageType === 'success' ? 'fas fa-check-circle text-[24px]' : 'fas fa-exclamation-circle text-[24px]'"
            ></i>
            <span>{{ checkoutMessage }}</span>
          </div>
        </div>
      </transition>
    </teleport>
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

    const toggleSelectAll = (event) => {
      if (event.target.checked) {
        selectedItems.value = cartItems.value.map(item => item.cartID)
      } else {
        selectedItems.value = []
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
      toggleSelectAll,
      checkout
    }
  }
}
</script>

<style scoped>
.alert-slide-enter-active {
  animation: slideDown 0.3s ease-out;
}

.alert-slide-leave-active {
  animation: slideUp 0.3s ease-in;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
  }
}
</style>
