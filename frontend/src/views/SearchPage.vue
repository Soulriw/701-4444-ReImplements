<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 20%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500]">
      <h1 class="text-[#FEC564] text-center pt-10 text-4xl font-bold" style="font-family: 'Irish Grover', cursive;">Search Results</h1>
      
    <!-- Search Container -->
    <div class="p-4 mx-auto max-w-[1400px] max-[1024px]:p-[12.8px] max-md:p-[9.6px] max-[440px]:p-[8px] max-[375px]:p-[6.4px]">
      <!-- Loading State -->
      <div v-if="loading" class="text-[#FEC564] text-center py-8 w-full">
        <h2 class="text-[#FEC564]">Searching...</h2>
      </div>
      


      <!-- Search Results Grid -->
       
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
        <div 
          v-for="book in paginatedResults" 
          :key="book.bookID" 
          class="w-full"
        >
          <BookItem :book="book" />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="searchResults.length > 0 && totalPages > 1" class="flex justify-center items-center gap-4 my-8 relative z-10 max-md:gap-3 max-md:my-6 max-[480px]:gap-2 max-[480px]:my-5 max-[375px]:gap-1.5 max-[375px]:my-4">
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-6 py-2 bg-[#FFB536] text-white border-none rounded-[25px] cursor-pointer transition-all duration-300 hover:bg-[#ff9900c7] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:opacity-70 text-[19.2px] max-md:px-4 max-md:py-1.5 max-md:text-[16px] max-md:rounded-[20px] max-[480px]:px-3 max-[480px]:py-1 max-[480px]:text-[14px] max-[480px]:rounded-[15px] max-[375px]:px-2.5 max-[375px]:py-0.5 max-[375px]:text-[12px] max-[375px]:rounded-[12px]"
          style="font-family: 'Irish Grover', cursive;"
        >
          Previous
        </button>
        <div class="flex gap-2 max-md:gap-1.5 max-[480px]:gap-1 max-[375px]:gap-0.5">
          <div 
            v-for="page in pageNumbers" 
            :key="page"
            class="w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer text-white bg-transparent border-2 border-transparent transition-all duration-300 hover:border-[#FFB536] text-[19.2px] max-md:w-[35px] max-md:h-[35px] max-md:text-[16px] max-[480px]:w-[30px] max-[480px]:h-[30px] max-[480px]:text-[14px] max-[375px]:w-[28px] max-[375px]:h-[28px] max-[375px]:text-[12px]"
            :class="{ 'bg-[#FFB536] border-[#FFB536]': page === currentPage }"
            @click="currentPage = page"
            style="font-family: 'Irish Grover', cursive;"
          >
            {{ page }}
          </div>
        </div>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-6 py-2 bg-[#FFB536] text-white border-none rounded-[25px] cursor-pointer transition-all duration-300 hover:bg-[#ff9900c7] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:opacity-70 text-[19.2px] max-md:px-4 max-md:py-1.5 max-md:text-[16px] max-md:rounded-[20px] max-[480px]:px-3 max-[480px]:py-1 max-[480px]:text-[14px] max-[480px]:rounded-[15px] max-[375px]:px-2.5 max-[375px]:py-0.5 max-[375px]:text-[12px] max-[375px]:rounded-[12px]"
          style="font-family: 'Irish Grover', cursive;"
        >
          Next
        </button>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBooksStore } from '../stores'
import BookItem from '../components/BookItem.vue'

export default {
  name: 'SearchPage',
  components: {
    BookItem
  },
  setup() {
    const route = useRoute()
    const booksStore = useBooksStore()
    
    const searchResults = ref([])
    const loading = ref(false)
    const searchTerm = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10

    const totalPages = computed(() => {
      return Math.ceil(searchResults.value.length / itemsPerPage)
    })

    const pageNumbers = computed(() => {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    })

    const paginatedResults = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return searchResults.value.slice(start, end)
    })

    const performSearch = async () => {
      const query = route.query.q
      if (!query) {
        searchResults.value = []
        return
      }

      searchTerm.value = query
      loading.value = true
      currentPage.value = 1

      try {
        const results = await booksStore.searchBooks(query)
        searchResults.value = results
      } catch (error) {
        console.error('Error searching books:', error)
        searchResults.value = []
      } finally {
        loading.value = false
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    onMounted(async () => {
      await booksStore.fetchPromotionBooks()
      await performSearch()
    })

    // Watch for route changes
    watch(() => route.query.q, () => {
      performSearch()
    })

    return {
      searchResults,
      loading,
      searchTerm,
      currentPage,
      totalPages,
      pageNumbers,
      paginatedResults,
      previousPage,
      nextPage
    }
  }
}
</script>
