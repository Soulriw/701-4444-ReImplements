<template>
  <div class="cart-page">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">Shopping Cart</h1>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <h2 style="color: #FEC564;">Loading cart...</h2>
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <i class="fas fa-shopping-cart fa-3x"></i>
          <h2>Your cart is empty</h2>
          <p>Add some magical books to get started!</p>
          <router-link to="/allProduct" class="btn btn-primary">
            Browse Books
          </router-link>
        </div>
      </div>

      <div v-else class="cart-content">
        <!-- Cart Items -->
        <div class="row">
          <div class="col-lg-8">
            <div class="cart-items">
              <div 
                v-for="item in cartItems" 
                :key="item.cartID" 
                class="cart-item"
              >
                <div class="item-checkbox">
                  <input 
                    type="checkbox" 
                    :id="`item-${item.cartID}`"
                    v-model="selectedItems"
                    :value="item.cartID"
                    class="item-check"
                  />
                  <label :for="`item-${item.cartID}`"></label>
                </div>

                <div class="item-image">
                  <img 
                    :src="`/src/model/image/books/${item.cartBookID}.jpg`" 
                    :alt="item.bookName"
                    @error="$event.target.src='/src/model/image/books/default.jpg'"
                  />
                </div>

                <div class="item-details">
                  <h3>{{ item.bookName }}</h3>
                  <p class="item-category">{{ item.categoryName }}</p>
                  <p class="item-description">{{ item.bookDescription }}</p>
                  
                  <div v-if="item.enchantment" class="item-enchantment">
                    <span class="enchantment-label">Enchantment:</span>
                    <span class="enchantment-value">{{ item.enchantment }}</span>
                  </div>

                  <div class="item-quantity">
                    <span class="quantity-label">Quantity:</span>
                    <span class="quantity-value">{{ item.quantity }}</span>
                  </div>
                </div>

                <div class="item-price">
                  <div v-if="item.isPromotionBook && item.hasDiscount" class="price-container">
                    <span class="original-price">{{ item.price }} G</span>
                    <span class="promo-price">{{ item.proPrice }} G</span>
                    <div class="discount-badge">{{ item.discountPercentage }}% OFF</div>
                  </div>
                  <div v-else class="price-container">
                    <span class="regular-price">{{ item.price }} G</span>
                  </div>
                  
                  <div class="total-price">
                    Total: {{ ((item.proPrice && item.proPrice !== item.price) ? item.proPrice : item.price) * item.quantity }} G
                  </div>
                </div>

                <div class="item-actions">
                  <button 
                    @click="removeItem(item.cartID)" 
                    class="remove-btn"
                    :disabled="removing"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="col-lg-4">
            <div class="cart-summary">
              <h3>Order Summary</h3>
              
              <div class="summary-item">
                <span>Items ({{ selectedItemsCount }}):</span>
                <span>{{ selectedTotalPrice }} G</span>
              </div>
              
              <div class="summary-total">
                <span>Total:</span>
                <span>{{ selectedTotalPrice }} G</span>
              </div>

              <button 
                @click="checkout" 
                :disabled="selectedItemsCount === 0 || checkingOut"
                class="checkout-btn"
              >
                <span v-if="checkingOut">Processing...</span>
                <span v-else>Checkout</span>
              </button>

              <div v-if="checkoutMessage" class="checkout-message" :class="checkoutMessageType">
                {{ checkoutMessage }}
              </div>
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
          const price = (item.proPrice && item.proPrice !== item.price) ? item.proPrice : item.price
          return total + (price * item.quantity)
        }, 0)
    })

    const fetchCartItems = async () => {
      try {
        await cartStore.fetchCartItems()
        cartItems.value = cartStore.items
        
        // Process promotion information - now using backend data
        cartItems.value.forEach(item => {
          // Check if item has promotion price from backend
          if (item.proPrice && item.proPrice !== item.price) {
            item.isPromotionBook = true
            item.hasDiscount = parseFloat(item.proPrice) < parseFloat(item.price)
            
            if (item.hasDiscount) {
              item.discountPercentage = Math.round((1 - (item.proPrice / item.price)) * 100)
            }
          } else {
            item.isPromotionBook = false
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

<style scoped>
.cart-page {
  padding: 2rem 0;
  min-height: 80vh;
}

.page-title {
  color: #FEC564;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.empty-cart-content {
  text-align: center;
  color: #ccc;
}

.empty-cart-content i {
  color: #FEC564;
  margin-bottom: 1rem;
}

.empty-cart-content h2 {
  color: #FEC564;
  margin-bottom: 1rem;
}

.empty-cart-content p {
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 1rem;
}

.item-checkbox {
  flex-shrink: 0;
}

.item-check {
  width: 20px;
  height: 20px;
  accent-color: #FEC564;
}

.item-image {
  flex-shrink: 0;
}

.item-image img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-details h3 {
  color: #FEC564;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.item-category {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-description {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-enchantment {
  margin-bottom: 0.5rem;
}

.enchantment-label {
  color: #888;
  font-size: 0.8rem;
}

.enchantment-value {
  color: #FEC564;
  font-weight: bold;
  margin-left: 0.5rem;
}

.item-quantity {
  margin-bottom: 0.5rem;
}

.quantity-label {
  color: #888;
  font-size: 0.8rem;
}

.quantity-value {
  color: white;
  font-weight: bold;
  margin-left: 0.5rem;
}

.item-price {
  text-align: right;
  flex-shrink: 0;
}

.price-container {
  margin-bottom: 0.5rem;
}

.original-price {
  color: #888;
  text-decoration: line-through;
  font-size: 0.9rem;
  display: block;
}

.promo-price {
  color: #FEC564;
  font-weight: bold;
  font-size: 1.1rem;
}

.regular-price {
  color: #FEC564;
  font-weight: bold;
  font-size: 1.1rem;
}

.discount-badge {
  background: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 0.25rem;
}

.total-price {
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.item-actions {
  flex-shrink: 0;
}

.remove-btn {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover:not(:disabled) {
  background: #ff6666;
  transform: scale(1.1);
}

.remove-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cart-summary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  position: sticky;
  top: 2rem;
}

.cart-summary h3 {
  color: #FEC564;
  margin-bottom: 1.5rem;
  text-align: center;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #ccc;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  color: #FEC564;
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.checkout-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: #FEC564;
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.checkout-btn:hover:not(:disabled) {
  background: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(254, 197, 100, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkout-message {
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.checkout-message.success {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.checkout-message.error {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  border: 1px solid rgba(255, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-image img {
    width: 120px;
    height: 180px;
  }
  
  .item-price {
    text-align: center;
  }
}
</style>

