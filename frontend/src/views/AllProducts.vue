<template>
  <div class="relative min-h-screen pt-20" style="background: linear-gradient(180deg, #2D1A47 20%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    <!-- Confetti dots background -->
    <div class="confetti-container fixed top-[70px] left-0 right-0 bottom-0 pointer-events-none z-0 overflow-hidden">
      <div 
        v-for="(dot, index) in confettiDots" 
        :key="index"
        class="confetti-dot absolute rounded-full"
        :style="{
          left: dot.x + '%',
          top: dot.y + '%',
          width: dot.size + 'px',
          height: dot.size + 'px',
          backgroundColor: '#FEC564',
          opacity: dot.opacity,
          animationDelay: dot.delay + 's'
        }"
      ></div>
    </div>

    <!-- Page Header -->
    <div class="text-center relative z-10">
      <h1 class="text-[#FEC564] text-4xl font-bold" style="font-family: 'Irish Grover', cursive;">All Magical Books</h1>
    </div>

    <!-- Category Filters -->
    <div class="relative z-10 my-8" v-if="categories.length > 0">
      <div class="flex flex-wrap justify-center gap-2 px-4">
        <div 
          v-for="category in categories" 
          :key="category.categoryID"
        >
          <div 
            class="px-4 py-4 bg-white/10 border-2 border-transparent rounded-[15px] cursor-pointer transition-all duration-300 text-white text-center text-[19.2px]"
            :class="{ 
              'bg-[rgba(254,197,100,0.2)] border-[#FEC564] shadow-[0_0_15px_rgba(254,197,100,0.5)]': currentCategory === category.categoryID, 
              'hover:bg-white/20 hover:-translate-y-[5px] hover:border-[#FEC564]': currentCategory !== category.categoryID 
            }"
            @click="filterByCategory(category.categoryID)"
          >
            {{ category.categoryName }}
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid Section -->
    <div class="relative z-10 px-4 max-w-[1400px] mx-auto">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center" id="allProductsGrid">
        <!-- Loading State -->
        <div v-if="loading" class="col-span-full text-center">
          <h2 class="text-[#FEC564] text-2xl font-bold" style="font-family: 'Irish Grover', cursive;">Loading magical collection...</h2>
        </div>
        
        <!-- No Results -->
        <div v-else-if="filteredBooks.length === 0" class="col-span-full text-center">
          <h2 class="text-[#FEC564] text-2xl font-bold" style="font-family: 'Irish Grover', cursive;">No books found in this category.</h2>
        </div>
        
        <!-- Books Grid -->
        <div 
          v-else
          v-for="book in currentPageBooks" 
          :key="book.bookID" 
          class="w-full"
        >
          <BookItem :book="book" />
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 my-8 relative z-10">
      <button 
        class="px-6 py-2 bg-[#FFB536] text-white border-none rounded-[25px] cursor-pointer transition-all duration-300 hover:bg-[#ff9900c7] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:opacity-70 text-[19.2px]"
        :disabled="currentPage === 1"
        @click="prevPage"
        style="font-family: 'Irish Grover', cursive;"
      >
        Prev
      </button>
      <div class="flex gap-2">
        <div 
          v-for="page in totalPages" 
          :key="page"
          class="w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer text-white bg-transparent border-2 border-transparent transition-all duration-300 hover:border-[#FFB536] text-[19.2px]"
          :class="{ 'bg-[#FFB536] border-[#FFB536]': page === currentPage }"
          @click="goToPage(page)"
          style="font-family: 'Irish Grover', cursive;"
        >
          {{ page }}
        </div>
      </div>
      <button 
        class="px-6 py-2 bg-[#FFB536] text-white border-none rounded-[25px] cursor-pointer transition-all duration-300 hover:bg-[#ff9900c7] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:opacity-70 text-[19.2px]"
        :disabled="currentPage === totalPages"
        @click="nextPage"
        style="font-family: 'Irish Grover', cursive;"
      >
        Next
      </button>
    </div>
    
    <div class="w-4/5 h-[2px] bg-[#fec564] mx-auto my-[40px] relative clear-both"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useBooksStore } from '../stores'
import BookItem from '../components/BookItem.vue'

export default {
  name: 'AllProducts',
  components: {
    BookItem
  },
  setup() {
    const booksStore = useBooksStore()
    
    const currentPage = ref(1)
    const itemsPerPage = 10
    const currentCategory = ref(null)
    const loading = ref(false)
    
    // Generate random confetti dots
    const generateConfettiDots = () => {
      const dots = []
      const dotCount = 80 // Number of confetti dots
      
      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * 100, // Random X position (0-100%)
          y: Math.random() * 100, // Random Y position (0-100%)
          size: Math.random() * 4 + 2, // Random size between 2-6px
          opacity: Math.random() * 0.6 + 0.3, // Random opacity between 0.3-0.9
          delay: Math.random() * 3 // Random animation delay
        })
      }
      
      return dots
    }
    
    const confettiDots = ref(generateConfettiDots())

    const books = computed(() => booksStore.books)
    const categories = computed(() => booksStore.categories)
    const promotionBooks = computed(() => booksStore.promotionBooks)

    const filteredBooks = computed(() => {
      if (currentCategory.value) {
        return books.value.filter(book => book.categoryID == currentCategory.value)
      }
      return books.value
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredBooks.value.length / itemsPerPage)
    })

    const currentPageBooks = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage
      const endIndex = Math.min(startIndex + itemsPerPage, filteredBooks.value.length)
      return filteredBooks.value.slice(startIndex, endIndex)
    })

    const filterByCategory = (categoryId) => {
      if (currentCategory.value === categoryId) {
        currentCategory.value = null
      } else {
        currentCategory.value = categoryId
      }
      currentPage.value = 1
      scrollToTop()
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        scrollToTop()
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        scrollToTop()
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
      scrollToTop()
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    onMounted(async () => {
      loading.value = true
      await Promise.all([
        booksStore.fetchBooks(),
        booksStore.fetchCategories(),
        booksStore.fetchPromotionBooks()
      ])
      loading.value = false
    })

    // Reset to first page when category changes
    watch(currentCategory, () => {
      currentPage.value = 1
    })

    return {
      currentPage,
      currentCategory,
      loading,
      books,
      categories,
      promotionBooks,
      filteredBooks,
      totalPages,
      currentPageBooks,
      filterByCategory,
      prevPage,
      nextPage,
      goToPage,
      scrollToTop,
      confettiDots
    }
  }
}
</script>

<style scoped>
/* Confetti dots animation */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
}

.confetti-dot {
  animation: twinkle 3s ease-in-out infinite;
  box-shadow: 0 0 4px rgba(254, 197, 100, 0.5);
}

.confetti-container {
  z-index: 0;
}
</style>

