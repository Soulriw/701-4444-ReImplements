<template>
  <nav class="h-20 px-8 flex items-center justify-between border-b-2 border-gold/30 bg-black fixed top-0 left-0 right-0 z-[1000]">
    <!-- Left Side: Logo and Search -->
    <div class="flex items-center gap-8">
      <!-- Logo with Toggle Navigation Function -->
      <div class="cursor-pointer transition-transform duration-300 hover:scale-105" @click="toggleNav">
        <img src="/src/model/image/navImg/logo.png" alt="Logo" class="h-[50px] w-auto" />
      </div>

      <!-- Search Form -->
      <form class="flex items-center bg-white/10 border border-white/20 rounded-[25px] px-4 py-2 transition-all duration-300 hover:border-gold" @submit.prevent="handleSearch" v-if="!isLoginOrRegister">
        <input 
          type="text" 
          class="bg-transparent border-none text-white px-4 py-2 outline-none text-base w-[250px] placeholder-white/50 max-md:w-[150px]" 
          v-model="searchTerm"
          placeholder="Search..." 
        />
        <button type="submit" class="bg-transparent border-none cursor-pointer p-1">
          <img src="/src/model/image/navImg/search.png" alt="" class="w-5 h-5" />
        </button>
      </form>
    </div>

    <!-- Cart Icon with Counter -->
    <router-link to="/cart" class="relative cursor-pointer transition-transform duration-300 hover:scale-110" v-if="!isLoginOrRegister">
      <img src="/src/model/image/navImg/cart.png" alt="" class="w-10 h-10" />
      <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{{ cartCount }}</span>
    </router-link>

    <!-- Navigation Menu -->
    <div 
      class="fixed top-20 left-0 w-[300px] h-[calc(100vh-80px)] bg-dark/98 border-r-2 border-gold/30 transition-transform duration-300 z-[999] overflow-y-auto max-md:w-full"
      :class="{ '-translate-x-full': !navOpen || isLoginOrRegister }" 
      id="nav" 
      v-if="!isLoginOrRegister"
    >
      <ul class="list-none p-8 m-0">
        <template v-if="isAuthenticated">
          <!-- Authenticated User Navigation -->
          <!-- Username Display -->
          <p class="text-gold px-8 py-4 border-b-2 border-gold/30 m-0 flex items-center font-bold">
            <img src="/src/model/image/login/userwhite.png" alt="username" class="w-6 h-6 mr-2">
            &nbsp;{{ truncateUsername(username) }}
          </p>

          <!-- Admin Links -->
          <template v-if="isAdmin">
            <router-link to="/categoryManagement" class="block px-8 py-4 text-[#ffd700] no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-[#ffd700]">
              <li class="list-none m-0 text-lg">Category Management</li>
            </router-link>
            <router-link to="/productManagement" class="block px-8 py-4 text-[#ffd700] no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-[#ffd700]">
              <li class="list-none m-0 text-lg">Product Management</li>
            </router-link>
            <router-link to="/history" class="block px-8 py-4 text-[#ffd700] no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-[#ffd700]">
              <li class="list-none m-0 text-lg">Sales History</li>
            </router-link>
            <a href="#" class="block px-8 py-4 text-[#ff4444] no-underline transition-all duration-300 border-b border-white/10 hover:bg-red/10 hover:text-[#ff4444]" @click.prevent="logout">
              <li class="list-none m-0 text-lg">Logout</li>
            </a>
          </template>
          
          <!-- Regular User Links -->
          <template v-else>
            <router-link to="/" class="block px-8 py-4 text-white no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-gold">
              <li class="list-none m-0 text-lg">Home</li>
            </router-link>
            <router-link to="/allProduct" class="block px-8 py-4 text-white no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-gold">
              <li class="list-none m-0 text-lg">All Product</li>
            </router-link>

            <!-- Categories Dropdown Menu -->
            <div class="relative">
              <a href="#" class="block px-8 py-4 text-white no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-gold cursor-pointer" @click.prevent="toggleCategoriesDropdown">
                <li class="list-none m-0 text-lg">Categories <i class="fas fa-caret-down"></i></li>
              </a>
              <div 
                id="categoriesDropdown" 
                class="bg-gold/10 pl-8 transition-all duration-300"
                :class="{ 'block': categoriesDropdownOpen, 'hidden': !categoriesDropdownOpen }"
              >
                <template v-if="categories.length > 0">
                  <router-link 
                    v-for="category in categories" 
                    :key="category.categoryID"
                    :to="`/category/${category.categoryID}`" 
                    class="block px-4 py-3 text-white no-underline transition-all duration-300 hover:bg-gold/20 hover:text-gold"
                    @click="closeDropdowns"
                  >
                    <li class="list-none m-0">{{ category.categoryName }}</li>
                  </router-link>
                </template>
                <template v-else>
                  <a href="#" class="block px-4 py-3 text-white no-underline transition-all duration-300 hover:bg-gold/20 hover:text-gold">
                    <li class="list-none m-0">No categories found</li>
                  </a>
                </template>
              </div>
            </div>

            <!-- Additional Links -->
            <router-link to="/contact" class="block px-8 py-4 text-white no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-gold">
              <li class="list-none m-0 text-lg">Contact</li>
            </router-link>
            <a href="#" class="block px-8 py-4 text-[#ff4444] no-underline transition-all duration-300 border-b border-white/10 hover:bg-red/10 hover:text-[#ff4444]" @click.prevent="logout">
              <li class="list-none m-0 text-lg">Logout</li>
            </a>
          </template>
        </template>
        <template v-else>
          <!-- Guest User Navigation -->
          <router-link to="/login" class="block px-8 py-4 text-white no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-gold">
            <li class="list-none m-0 text-lg">Login</li>
          </router-link>
          <router-link to="/register" class="block px-8 py-4 text-white no-underline transition-all duration-300 border-b border-white/10 hover:bg-gold/10 hover:text-gold">
            <li class="list-none m-0 text-lg">Register</li>
          </router-link>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useCartStore, useBooksStore } from '../stores'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    const booksStore = useBooksStore()
    
    const navOpen = ref(false)
    const categoriesDropdownOpen = ref(false)
    const searchTerm = ref('')
    const isAuthenticated = ref(false)
    const username = ref('')

    const isAdmin = ref(false)

    const updateAuthState = () => {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          isAuthenticated.value = true
          username.value = user?.username || ''
          isAdmin.value = user?.isAdmin || false
        } else {
          isAuthenticated.value = false
          username.value = ''
          isAdmin.value = false
        }
      } catch (error) {
        console.error('Error parsing user:', error)
        isAuthenticated.value = false
        username.value = ''
        isAdmin.value = false
      }
    }

    const categories = computed(() => booksStore.categories)
    const cartCount = computed(() => cartStore.count)
    
    // Check if current route is login or register page
    const isLoginOrRegister = computed(() => {
      const currentPath = router.currentRoute.value.path
      return currentPath === '/login' || currentPath === '/register'
    })

    const toggleNav = () => {
      navOpen.value = !navOpen.value
      categoriesDropdownOpen.value = false
    }

    const toggleCategoriesDropdown = (event) => {
      event.stopPropagation()
      categoriesDropdownOpen.value = !categoriesDropdownOpen.value
    }

    const closeDropdowns = () => {
      navOpen.value = false
      categoriesDropdownOpen.value = false
    }

    const handleSearch = () => {
      if (searchTerm.value.trim()) {
        router.push({ name: 'SearchPage', query: { q: searchTerm.value } })
        searchTerm.value = ''
        closeDropdowns()
      }
    }

    const logout = () => {
      authStore.logout()
      // Force a full page reload to clear all state
      globalThis.location.href = '/login'
    }

    const truncateUsername = (username, maxLength = 9) => {
      if (username.length <= maxLength) {
        return username
      }
      return username.substring(0, maxLength) + '..'
    }

    onMounted(async () => {
      // Initialize auth
      authStore.initializeAuth()
      updateAuthState()
      
      await booksStore.fetchCategories()
      await cartStore.getCartCount()
      
      // Watch for route changes to update auth state
      watch(() => router.currentRoute.value.path, () => {
        updateAuthState()
      })
      
      // Set up polling to refresh cart count periodically
      setInterval(() => {
        cartStore.getCartCount()
      }, 30000)
    })

    return {
      navOpen,
      categoriesDropdownOpen,
      searchTerm,
      isAuthenticated,
      isAdmin,
      username,
      categories,
      cartCount,
      isLoginOrRegister,
      toggleNav,
      toggleCategoriesDropdown,
      closeDropdowns,
      handleSearch,
      logout,
      truncateUsername,
      updateAuthState
    }
  }
}
</script>