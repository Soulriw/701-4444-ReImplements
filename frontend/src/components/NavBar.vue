<template>
  <nav class="sticky top-0 flex items-center justify-between bg-black w-full p-[5px] border-b-[3px] border-white flex-nowrap z-[1000] max-md:p-[3px] max-md:border-b-[2px] max-[480px]:p-[2px] max-[480px]:border-b-[1.5px] max-[375px]:p-[2px] max-[375px]:border-b-[1px]">
    <!-- Left Side: Logo and Search -->
    <div class="flex items-center bg-black p-[10px] text-white max-md:p-[8px] max-[480px]:p-[6px] max-[375px]:p-[5px]">
      <!-- Logo with Toggle Navigation Function -->
      <div class="cursor-pointer mt-[5px] ml-[15px] mr-[15px] max-md:mt-[3px] max-md:ml-[10px] max-md:mr-[10px] max-[480px]:mt-[2px] max-[480px]:ml-[8px] max-[480px]:mr-[8px] max-[375px]:mt-[2px] max-[375px]:ml-[6px] max-[375px]:mr-[6px]" @click="toggleNav">
        <img src="/src/model/image/navImg/logo.png" alt="Logo" class="h-[50px] w-auto max-md:h-[40px] max-[480px]:h-[35px] max-[375px]:h-[30px]" />
      </div>

      <!-- Search Form -->
      <form class="flex items-center relative" @submit.prevent="handleSearch" v-if="!isLoginOrRegister">
        <input 
          type="text" 
          class="bg-[#929292] border-none rounded-[22px] w-[900px] h-[50px] ml-[20px] pl-[20px] pr-[50px] text-[20px] text-white max-[1024px]:w-[400px] max-[1024px]:h-[40px] max-[1024px]:rounded-[18px] max-[1024px]:ml-[15px] max-[1024px]:pl-[15px] max-[1024px]:pr-[40px] max-[1024px]:text-[18px] max-md:w-[180px] max-md:h-[35px] max-md:rounded-[15px] max-md:ml-[10px] max-md:pl-[12px] max-md:pr-[35px] max-md:text-[14px] max-md:mr-[10px] max-[480px]:w-[140px] max-[480px]:h-[32px] max-[480px]:rounded-[12px] max-[480px]:ml-[8px] max-[480px]:pl-[10px] max-[480px]:pr-[30px] max-[480px]:text-[12px] max-[480px]:mr-[5px] max-[375px]:w-[110px] max-[375px]:h-[28px] max-[375px]:rounded-[10px] max-[375px]:ml-[6px] max-[375px]:pl-[8px] max-[375px]:pr-[26px] max-[375px]:text-[11px] max-[375px]:mr-[4px]" 
          v-model="searchTerm"
          placeholder="Search..." 
        />
        <button type="submit" class="absolute right-[12px] top-1/2 -translate-y-1/2 bg-transparent text-white cursor-pointer border-none flex items-center justify-center h-[50px] max-[1024px]:right-[10px] max-[1024px]:h-[40px] max-md:right-[8px] max-md:h-[35px] max-[480px]:right-[6px] max-[480px]:h-[32px] max-[375px]:right-[5px] max-[375px]:h-[28px]">
          <img src="/src/model/image/navImg/search.png" alt="" class="h-[25px] max-[1024px]:h-[18px] max-md:h-[16px] max-[480px]:h-[14px] max-[375px]:h-[12px]" />
        </button>
      </form>
    </div>

    <!-- Cart Icon with Counter -->
    <router-link to="/cart" class="mr-[20px] relative max-md:mr-[15px] max-[480px]:mr-[12px] max-[375px]:mr-[10px]" v-if="!isLoginOrRegister">
      <img src="/src/model/image/navImg/cart.png" alt="" class="h-[50px] max-[1024px]:h-[35px] max-md:h-[32px] max-[480px]:h-[28px] max-[375px]:h-[25px]" />
      <span v-if="cartCount > 0" class="absolute top-[-8px] right-[-8px] bg-[#FEC564] text-[#2D1A47] text-[14px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center p-[2px] max-[1024px]:text-[12px] max-[1024px]:min-w-[18px] max-[1024px]:h-[18px] max-[1024px]:top-[-6px] max-[1024px]:right-[-6px] max-md:text-[11px] max-md:min-w-[16px] max-md:h-[16px] max-md:top-[-5px] max-md:right-[-5px] max-[480px]:text-[10px] max-[480px]:min-w-[14px] max-[480px]:h-[14px] max-[480px]:top-[-4px] max-[480px]:right-[-4px] max-[375px]:text-[9px] max-[375px]:min-w-[12px] max-[375px]:h-[12px] max-[375px]:top-[-3px] max-[375px]:right-[-3px]">{{ cartCount }}</span>
    </router-link>

    <!-- Navigation Menu -->
    <div 
      class="fixed left-0 top-[83px] w-[225px] h-auto bg-black transition-transform duration-300 border-[3px] border-white z-[1000] max-[1024px]:w-[190px] max-[1024px]:top-[68px] max-md:w-[150px] max-md:top-[64px] max-[480px]:w-[140px] max-[480px]:top-[53px] max-[480px]:border-[2px] max-[375px]:w-[130px] max-[375px]:top-[45px] max-[375px]:border-[1.5px]"
      :class="{ '-translate-x-[101%]': !navOpen || isLoginOrRegister }" 
      id="nav" 
      v-if="!isLoginOrRegister"
    >
      <ul class="list-none p-0 m-0">
        <template v-if="isAuthenticated">
          <!-- Authenticated User Navigation -->
          <!-- Username Display -->
          <p class="bg-[#FFB63A] text-white rounded-none h-[80px] w-[220px] mb-[7px] flex items-center text-[30px] border-b-[2px] border-white overflow-hidden whitespace-nowrap text-ellipsis pr-[15px] max-[1024px]:h-[70px] max-[1024px]:w-[185.5px] max-[1024px]:text-[25px] max-[1024px]:pr-[12px] max-md:h-[55px] max-md:w-[145.5px] max-md:text-[18px] max-md:pr-[10px] max-md:mb-[5px] max-[480px]:h-[50px] max-[480px]:w-[135px] max-[480px]:text-[16px] max-[480px]:pr-[8px] max-[480px]:mb-[4px] max-[480px]:border-b-[1.5px] max-[375px]:h-[45px] max-[375px]:w-[125px] max-[375px]:text-[14px] max-[375px]:pr-[6px] max-[375px]:mb-[3px] max-[375px]:border-b-[1px] m-0 pl-[15px] max-md:pl-[12px] max-[480px]:pl-[10px] max-[375px]:pl-[8px]">
            <img src="/src/model/image/login/userwhite.png" alt="username" class="w-[35px] h-[35px] ml-[10px] max-[1024px]:w-[30px] max-[1024px]:h-[30px] max-[1024px]:ml-[8px] max-md:w-[28px] max-md:h-[28px] max-md:ml-[6px] max-[480px]:w-[24px] max-[480px]:h-[24px] max-[480px]:ml-[5px] max-[375px]:w-[20px] max-[375px]:h-[20px] max-[375px]:ml-[4px]">
            &nbsp;{{ truncateUsername(username) }}
          </p>

          <!-- Admin Links -->
          <template v-if="isAdmin">
            <router-link to="/categoryManagement" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Category Management</li>
            </router-link>
            <router-link to="/productManagement" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Product Management</li>
            </router-link>
            <router-link to="/history" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">History</li>
            </router-link>
            <a href="#" class="no-underline text-[#ff4444]" @click.prevent="logout">
              <li class="p-[15px] text-[#ff4444] text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Logout</li>
            </a>
          </template>
          
          <!-- Regular User Links -->
          <template v-else>
            <router-link to="/" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Home</li>
            </router-link>
            <router-link to="/allProduct" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">All Product</li>
            </router-link>

            <!-- Categories Dropdown Menu -->
            <div class="relative w-full">
              <a href="#" class="no-underline text-white cursor-pointer flex justify-between items-center w-full" @click.prevent="toggleCategoriesDropdown">
                <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px] list-none m-0 w-full">Categories <i class="fas fa-caret-down text-[16px] ml-[5px] max-md:text-[14px] max-[480px]:text-[12px] max-[375px]:text-[11px]"></i></li>
              </a>
              <div 
                id="categoriesDropdown" 
                class="w-full bg-black max-h-[230px] overflow-y-scroll max-[1024px]:max-h-[200px] max-md:max-h-[130px] max-md:w-[145px] max-[480px]:max-h-[120px] max-[480px]:w-[136px] max-[375px]:max-h-[110px] max-[375px]:w-[126px]"
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
                    <li class="text-white pt-[10px] pr-[15px] pb-[10px] pl-[25px] ml-[20px] w-[186px] rounded-[15px] max-[1024px]:w-[155px] max-[1024px]:hover:w-[145px] max-[1024px]:pt-[8px] max-[1024px]:pb-[8px] max-[1024px]:pl-[20px] max-[1024px]:ml-[15px] max-md:pt-[8px] max-md:pr-[12px] max-md:pb-[8px] max-md:pl-[10px] max-md:ml-[10px] max-md:w-[115px] max-md:hover:w-[100px] max-md:text-[13px] max-[480px]:pt-[7px] max-[480px]:pr-[10px] max-[480px]:pb-[7px] max-[480px]:pl-[8px] max-[480px]:ml-[8px] max-[480px]:w-[106px] max-[480px]:hover:w-[106px] max-[480px]:text-[12px] max-[375px]:pt-[6px] max-[375px]:pr-[8px] max-[375px]:pb-[6px] max-[375px]:pl-[7px] max-[375px]:ml-[7px] max-[375px]:w-[96px] max-[375px]:hover:w-[96px] max-[375px]:text-[11px]">{{ category.categoryName }}</li>
                  </router-link>
                </template>
                <template v-else>
                  <a href="#" class="block no-underline text-black w-full hover:bg-transparent">
                    <li class="pt-[10px] pr-[15px] pb-[10px] pl-[25px] ml-[20px] w-[186px] rounded-[15px] text-black max-[1024px]:w-[155px] max-[1024px]:hover:w-[145px] max-[1024px]:pt-[8px] max-[1024px]:pb-[8px] max-[1024px]:pl-[20px] max-[1024px]:ml-[15px] max-md:pt-[8px] max-md:pr-[12px] max-md:pb-[8px] max-md:pl-[10px] max-md:ml-[10px] max-md:w-[115px] max-md:hover:w-[100px] max-md:text-[13px] max-[480px]:pt-[7px] max-[480px]:pr-[10px] max-[480px]:pb-[7px] max-[480px]:pl-[8px] max-[480px]:ml-[8px] max-[480px]:w-[106px] max-[480px]:hover:w-[106px] max-[480px]:text-[12px] max-[375px]:pt-[6px] max-[375px]:pr-[8px] max-[375px]:pb-[6px] max-[375px]:pl-[7px] max-[375px]:ml-[7px] max-[375px]:w-[96px] max-[375px]:hover:w-[96px] max-[375px]:text-[11px]">No categories found</li>
                  </a>
                </template>
              </div>
            </div>

            <!-- Additional Links -->
            <router-link to="/contact" class="no-underline text-white" @click="closeDropdowns">
              <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Contact</li>
            </router-link>
            <a href="#" class="no-underline text-[#ff4444]" @click.prevent="logout">
              <li class="p-[15px] text-[#ff4444] text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Logout</li>
            </a>
          </template>
        </template>
        <template v-else>
          <!-- Guest User Navigation -->
          <router-link to="/login" class="no-underline text-white" @click="closeDropdowns">
            <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Login</li>
          </router-link>
          <router-link to="/register" class="no-underline text-white" @click="closeDropdowns">
            <li class="p-[15px] text-white text-[25px] cursor-pointer transition-colors duration-200 rounded-[15px] hover:bg-[#FFB63A] hover:w-[220px] max-[1024px]:text-[20px] max-[1024px]:hover:w-[186px] max-[1024px]:p-[12px] max-md:text-[14px] max-md:hover:w-[146px] max-md:active:w-[145px] max-md:p-[10px] max-[480px]:text-[13px] max-[480px]:p-[8px] max-[480px]:hover:w-[136px] max-[375px]:text-[12px] max-[375px]:p-[7px] max-[375px]:hover:w-[126px]">Register</li>
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