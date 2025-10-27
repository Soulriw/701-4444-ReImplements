<template>
  <nav class="navbar navbar-expand-lg bg-black fixed-top">
    <!-- Left Side: Logo and Search -->
    <div class="navcon">
      <!-- Logo with Toggle Navigation Function -->
      <div class="navbar-brand" @click="toggleNav">
        <img src="/src/model/image/navImg/logo.png" alt="Logo" />
      </div>

      <!-- Search Form -->
      <form class="search" @submit.prevent="handleSearch">
        <input 
          type="text" 
          class="search-bar" 
          v-model="searchTerm"
          placeholder="Search..." 
        />
        <button type="submit">
          <img src="/src/model/image/navImg/search.png" alt="" />
        </button>
      </form>
    </div>

    <!-- Cart Icon with Counter -->
    <router-link to="/cart" class="cart">
      <img src="/src/model/image/navImg/cart.png" alt="" />
      <span class="cart-counter" v-if="cartCount > 0">{{ cartCount }}</span>
    </router-link>

    <!-- Navigation Menu -->
    <div class="nav" :class="{ hidden: !navOpen }" id="nav">
      <ul>
        <template v-if="isAuthenticated">
          <!-- Authenticated User Navigation -->
          <!-- Username Display -->
          <p class="usernameList">
            <img src="/src/model/image/login/userwhite.png" alt="username" class="username-img-nav">
            &nbsp;{{ truncateUsername(username) }}
          </p>

          <!-- Main Navigation Links -->
          <router-link to="/" class="nav-item home">
            <li>Home</li>
          </router-link>
          <router-link to="/allProduct" class="nav-item home">
            <li>All Product</li>
          </router-link>

          <!-- Categories Dropdown Menu -->
          <div class="dropdown-container">
            <a href="#" class="nav-item dropdown-toggle" @click.prevent="toggleCategoriesDropdown">
              <li>Categories <i class="fas fa-caret-down"></i></li>
            </a>
            <div id="categoriesDropdown" class="categories-dropdown" :class="{ show: categoriesDropdownOpen }">
              <template v-if="categories.length > 0">
                <router-link 
                  v-for="category in categories" 
                  :key="category.categoryID"
                  :to="`/category/${category.categoryID}`" 
                  class="dropdown-item"
                  @click="closeDropdowns"
                >
                  <li>{{ category.categoryName }}</li>
                </router-link>
              </template>
              <template v-else>
                <a href="#" class="dropdown-item">
                  <li>No categories found</li>
                </a>
              </template>
            </div>
          </div>

          <!-- Additional Links -->
          <router-link to="/contact" class="nav-item home">
            <li>Contact</li>
          </router-link>
          <a href="#" class="nav-item logout" @click.prevent="logout">
            <li>Logout</li>
          </a>
        </template>
        <template v-else>
          <!-- Guest User Navigation -->
          <router-link to="/login" class="nav-item login">
            <li>Login</li>
          </router-link>
          <router-link to="/register" class="nav-item register">
            <li>Register</li>
          </router-link>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores'
import { useCartStore } from '../stores'
import { useBooksStore } from '../stores'

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

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const username = computed(() => authStore.username)
    const categories = computed(() => booksStore.categories)
    const cartCount = computed(() => cartStore.count)

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
      router.push('/login')
    }

    const truncateUsername = (username, maxLength = 9) => {
      if (username.length <= maxLength) {
        return username
      }
      return username.substring(0, maxLength) + '..'
    }

    onMounted(async () => {
      await booksStore.fetchCategories()
      await cartStore.getCartCount()
      
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
      username,
      categories,
      cartCount,
      toggleNav,
      toggleCategoriesDropdown,
      closeDropdowns,
      handleSearch,
      logout,
      truncateUsername
    }
  }
}
</script>

<style scoped>
/* Navigation Bar Styles */
.navbar {
  height: 80px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(254, 197, 100, 0.3);
  z-index: 1000;
}

.navcon {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-brand {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.navbar-brand img {
  height: 50px;
  width: auto;
}

/* Search Form */
.search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.search:hover {
  border-color: #FEC564;
}

.search-bar {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  outline: none;
  font-size: 1rem;
  width: 250px;
}

.search-bar::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.search button img {
  width: 20px;
  height: 20px;
}

/* Cart Icon */
.cart {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cart:hover {
  transform: scale(1.1);
}

.cart img {
  width: 40px;
  height: 40px;
}

.cart-counter {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FEC564;
  color: #000;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Navigation Menu */
.nav {
  position: fixed;
  top: 80px;
  left: 0;
  width: 300px;
  height: calc(100vh - 80px);
  background: rgba(10, 10, 10, 0.98);
  border-right: 2px solid rgba(254, 197, 100, 0.3);
  transform: translateX(0);
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.nav.hidden {
  transform: translateX(-100%);
}

.nav ul {
  list-style: none;
  padding: 2rem 0;
  margin: 0;
}

.nav-item {
  display: block;
  padding: 1rem 2rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item:hover {
  background: rgba(254, 197, 100, 0.1);
  color: #FEC564;
}

.nav-item li {
  list-style: none;
  margin: 0;
  font-size: 1.1rem;
}

.usernameList {
  color: #FEC564;
  padding: 1rem 2rem;
  border-bottom: 2px solid rgba(254, 197, 100, 0.3);
  margin: 0;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.username-img-nav {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}

/* Dropdown */
.dropdown-container {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
}

.categories-dropdown {
  display: none;
  background: rgba(254, 197, 100, 0.1);
  padding-left: 2rem;
}

.categories-dropdown.show {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(254, 197, 100, 0.2);
  color: #FEC564;
}

.logout {
  color: #ff4444 !important;
}

.logout:hover {
  background: rgba(255, 68, 68, 0.1) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .search-bar {
    width: 150px;
  }
  
  .nav {
    width: 100%;
  }
}
</style>

