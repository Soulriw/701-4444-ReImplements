<template>
  <nav class="flex items-center justify-between bg-black w-full p-[5px] border-b-[3px] border-white flex-nowrap z-[1000]">
    <!-- Left Side: Logo and Search -->
    <div class="flex items-center bg-black p-[10px] text-white">
      <!-- Logo with Toggle Navigation Function -->
      <div class="cursor-pointer mt-[5px] ml-[15px] mr-[15px]" @click="toggleNav">
        <img src="/src/model/image/navImg/logo.png" alt="Logo" class="h-[50px] w-auto" />
      </div>

      <!-- Search Form -->
      <form class="flex items-center" @submit.prevent="handleSearch" v-if="!isLoginOrRegister">
        <input 
          type="text" 
          class="bg-[#929292] border-none rounded-[22px] w-[900px] h-[50px] ml-[20px] pl-[20px] text-[20px] text-white max-[1024px]:w-[400px] max-[1024px]:h-[40px] max-[1024px]:rounded-[18px] max-md:w-[225px] max-md:mr-[10px] max-[440px]:w-[175px] max-[440px]:mr-[5px]" 
          v-model="searchTerm"
          placeholder="Search..." 
        />
        <button type="submit" class="bg-transparent pb-[11px] pt-[5px] text-white text-[25px] cursor-pointer absolute top-[22px] left-[965px] rounded-[50px] border-none h-[50px] max-[1024px]:left-[470px] max-[1024px]:text-[20px] max-md:left-[300px] max-[440px]:left-[250px]">
          <img src="/src/model/image/navImg/search.png" alt="" class="h-[25px] max-[1024px]:h-[20px]" />
        </button>
      </form>
    </div>

    <!-- Cart Icon with Counter -->
    <router-link to="/cart" class="mr-[20px] relative" v-if="!isLoginOrRegister">
      <img src="/src/model/image/navImg/cart.png" alt="" class="h-[50px] max-[1024px]:h-[30px]" />
      <span v-if="cartCount > 0" class="absolute top-[-8px] right-[-8px] bg-[#FEC564] text-[#2D1A47] text-[14px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center p-[2px] max-[1024px]:text-[12px] max-[1024px]:min-w-[18px] max-[1024px]:h-[18px] max-[1024px]:top-[-5px] max-[1024px]:right-[-5px] max-md:text-[11px] max-md:min-w-[16px] max-md:h-[16px] max-[440px]:text-[10px] max-[440px]:min-w-[14px] max-[440px]:h-[14px] max-[440px]:top-[-4px] max-[440px]:right-[-4px]">{{ cartCount }}</span>
    </router-link>

    <!-- Navigation Menu -->
    <div 
      class="fixed left-0 top-[95px] w-[225px] h-auto bg-black transition-transform duration-300 border-[3px] border-white z-[1000] max-[1024px]:w-[190px] max-md:w-[150px]"
      :class="{ '-translate-x-[101%]': !navOpen || isLoginOrRegister }" 
      id="nav" 
      v-if="!isLoginOrRegister"
    >
      <ul class="list-none p-0 m-0">
        <template v-if="isAuthenticated">
          <!-- Authenticated User Navigation -->
          <!-- Username Display -->
          <p class="bg-[#FFB63A] text-white rounded-none h-[80px] w-[220px] mb-[7px] flex items-center text-[30px] border-b-[2px] border-white overflow-hidden whitespace-nowrap text-ellipsis pr-[15px] max-[1024px]:h-[70px] max-[1024px]:w-[185.5px] max-[1024px]:text-[25px] max-md:h-[60px] max-md:w-[145.5px] max-md:text-[20px] max-[440px]:h-[55px] max-[440px]:text-[16.5px] m-0 pl-[15px]">
            <img src="/src/model/image/login/userwhite.png" alt="username" class="w-[35px] h-[35px] ml-[10px] max-md:w-[30px] max-md:h-[30px] max-[440px]:w-[25px] max-[440px]:h-[25px]">
            &nbsp;{{ truncateUsername(username) }}
          </p>

          <!-- Admin Links -->
          <template v-if="isAdmin">
            <router-link to="/categoryManagement" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Category Management</li>
            </router-link>
            <router-link to="/productManagement" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Product Management</li>
            </router-link>
            <router-link to="/history" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Sales History</li>
            </router-link>
            <a href="#" class="no-underline text-[#ff4444]" @click.prevent="logout">
              <li class="p-[15px] text-[#ff4444] text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Logout</li>
            </a>
          </template>
          
          <!-- Regular User Links -->
          <template v-else>
            <router-link to="/" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Home</li>
            </router-link>
            <router-link to="/allProduct" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">All Product</li>
            </router-link>

            <!-- Categories Dropdown Menu -->
            <div class="relative w-full">
              <a href="#" class="no-underline text-white cursor-pointer flex justify-between items-center w-full" @click.prevent="toggleCategoriesDropdown">
                <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px] list-none m-0 w-full">Categories <i class="fas fa-caret-down text-[16px] ml-[5px]"></i></li>
              </a>
              <div 
                id="categoriesDropdown" 
                class="w-full bg-black max-h-[230px] overflow-y-scroll max-[1024px]:max-h-[200px] max-md:max-h-[130px] max-md:w-[145px] max-[440px]:min-w-[100px] max-[440px]:max-h-[120px]"
                :class="{ 'block': categoriesDropdownOpen, 'hidden': !categoriesDropdownOpen }"
              >
                <template v-if="categories.length > 0">
                  <router-link 
                    v-for="category in categories" 
                    :key="category.categoryID"
                    :to="`/category/${category.categoryID}`" 
                    class="block no-underline text-black w-full hover:bg-transparent"
                    @click="closeDropdowns"
                  >
                    <li class="text-white pt-[10px] pr-[15px] pb-[10px] pl-[25px] ml-[20px] w-[186px] rounded-[15px] text-black max-[1024px]:w-[155px] max-[1024px]:hover:w-[145px] max-md:pt-[10px] max-md:pr-[15px] max-md:pb-[10px] max-md:pl-[10px] max-md:ml-[10px] max-md:w-[115px] max-md:hover:w-[100px] max-[440px]:w-[100px] max-[440px]:hover:w-[100px]">{{ category.categoryName }}</li>
                  </router-link>
                </template>
                <template v-else>
                  <a href="#" class="block no-underline text-black w-full hover:bg-transparent">
                    <li class="pt-[10px] pr-[15px] pb-[10px] pl-[25px] ml-[20px] w-[186px] rounded-[15px] text-black max-[1024px]:w-[155px] max-[1024px]:hover:w-[145px] max-md:pt-[10px] max-md:pr-[15px] max-md:pb-[10px] max-md:pl-[10px] max-md:ml-[10px] max-md:w-[115px] max-md:hover:w-[100px] max-[440px]:w-[100px] max-[440px]:hover:w-[100px]">No categories found</li>
                  </a>
                </template>
              </div>
            </div>

            <!-- Additional Links -->
            <router-link to="/contact" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Contact</li>
            </router-link>
            <a href="#" class="no-underline text-[#ff4444]" @click.prevent="logout">
              <li class="p-[15px] text-[#ff4444] text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Logout</li>
            </a>
          </template>
        </template>
        <template v-else>
          <!-- Guest User Navigation -->
          <router-link to="/login" class="no-underline text-white" @click="closeDropdowns">
            <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Login</li>
          </router-link>
          <router-link to="/register" class="no-underline text-white" @click="closeDropdowns">
            <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-md:text-[15px] max-md:hover:w-[146px] max-md:active:w-[145px]">Register</li>
          </router-link>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
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

    // Use computed values from authStore for reactivity
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const username = computed(() => authStore.username)
    const isAdmin = computed(() => authStore.isAdmin)

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
      truncateUsername
    }
  }
}
</script>