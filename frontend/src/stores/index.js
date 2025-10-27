import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  
  getters: {
    isAdmin: (state) => state.user?.isAdmin || false,
    username: (state) => state.user?.username || ''
  },
  
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/login', credentials)
        if (response.data.success) {
          this.user = response.data.user
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(this.user))
          return { success: true }
        }
        return { success: false, error: response.data.error }
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Login failed' }
      }
    },
    
    async register(userData) {
      try {
        const response = await axios.post('/api/register', userData)
        if (response.data.success) {
          this.user = response.data.user
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(this.user))
          return { success: true }
        }
        return { success: false, error: response.data.error }
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Registration failed' }
      }
    },
    
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },
    
    initializeAuth() {
      const user = localStorage.getItem('user')
      if (user) {
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    }
  }
})

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    count: 0
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => {
      const price = item.isPromotionBook ? item.proPrice : item.price
      return total + (price * item.quantity)
    }, 0)
  },
  
  actions: {
    async fetchCartItems() {
      try {
        const response = await axios.get('/api/cart')
        this.items = response.data
        this.count = this.totalItems
      } catch (error) {
        console.error('Error fetching cart items:', error)
      }
    },
    
    async addToCart(bookData) {
      try {
        const response = await axios.post('/api/cart/add', bookData)
        if (response.data.success) {
          await this.fetchCartItems()
          return { success: true }
        }
        return { success: false, error: response.data.error }
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Failed to add to cart' }
      }
    },
    
    async removeFromCart(cartId) {
      try {
        await axios.delete(`/api/cart/remove/${cartId}`)
        await this.fetchCartItems()
        return { success: true }
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Failed to remove from cart' }
      }
    },
    
    async checkout(cartIds) {
      try {
        const response = await axios.post('/api/checkout', { cartIds })
        if (response.data.success) {
          await this.fetchCartItems()
          return { success: true }
        }
        return { success: false, error: response.data.error }
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Checkout failed' }
      }
    },
    
    async getCartCount() {
      try {
        const response = await axios.get('/api/cart/count')
        this.count = response.data.count
      } catch (error) {
        console.error('Error getting cart count:', error)
      }
    }
  }
})

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    categories: [],
    promotionBooks: [],
    loading: false
  }),
  
  actions: {
    async fetchBooks() {
      this.loading = true
      try {
        const response = await axios.get('/api/allBooks')
        this.books = response.data
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchCategories() {
      try {
        const response = await axios.get('/api/categories')
        this.categories = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    
    async fetchPromotionBooks() {
      try {
        const response = await axios.get('/api/promotionBooks')
        this.promotionBooks = response.data
      } catch (error) {
        console.error('Error fetching promotion books:', error)
      }
    },
    
    async searchBooks(searchTerm) {
      try {
        const response = await axios.get(`/api/search?term=${searchTerm}`)
        return response.data
      } catch (error) {
        console.error('Error searching books:', error)
        return []
      }
    }
  }
})

