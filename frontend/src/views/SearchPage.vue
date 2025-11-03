<template>
  <div>
    <!-- Search Container -->
    <div class="p-4 mx-auto max-w-[1400px] max-[1024px]:p-[12.8px] max-md:p-[9.6px] max-[440px]:p-[8px] max-[375px]:p-[6.4px]">
      <!-- Loading State -->
      <div v-if="loading" class="text-[#FEC564] text-center py-8 w-full">
        <h2 class="text-[#FEC564]">Searching...</h2>
      </div>

      <!-- Empty State -->
      <div v-else-if="searchResults.length === 0" class="text-[#FEC564] text-center py-8 w-full">
        <i class="fas fa-search fa-3x text-[#FEC564] mb-4"></i>
        <h2 class="text-[#FEC564] mb-4">No books found</h2>
        <p class="text-gray-400">Try searching with different keywords</p>
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
      <div v-if="searchResults.length > 0 && totalPages > 1" class="flex justify-center items-center gap-4 my-8 max-[440px]:gap-2 max-[440px]:my-6 max-[375px]:gap-2 max-[375px]:my-[24px]">
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          class="bg-[#FFB536] text-white border-none py-2 px-6 rounded-[25px] cursor-pointer font-['Irish_Grover'] text-[19.2px] transition-colors duration-300 ease-in-out disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#ff9900c7] max-[1024px]:py-[6.4px] max-[1024px]:px-[19.2px] max-[1024px]:text-[17.6px] max-md:py-[4.8px] max-md:px-4 max-md:text-base max-[440px]:py-[4.8px] max-[440px]:px-[12.8px] max-[440px]:text-[14.4px] max-[375px]:py-[4px] max-[375px]:px-[11.2px] max-[375px]:text-[13.6px]"
        >
          Previous
        </button>
        <div class="flex gap-2 items-center max-[440px]:gap-2 max-[375px]:gap-2">
          <button 
            v-for="page in pageNumbers" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 flex items-center justify-center rounded-full cursor-pointer font-[\'Irish_Grover\'] text-[19.2px] text-white bg-transparent border-[2px] border-transparent transition-all duration-300 ease-in-out hover:border-[#FFB536] max-[1024px]:w-[35px] max-[1024px]:h-[35px] max-[1024px]:text-[17.6px] max-md:w-[30px] max-md:h-[30px] max-md:text-base max-[440px]:w-[28px] max-[440px]:h-[28px] max-[440px]:text-[14.4px] max-[375px]:w-[25px] max-[375px]:h-[25px] max-[375px]:text-[13.6px]',
              currentPage === page ? 'bg-[#FFB536] text-white border-transparent' : 'text-white bg-transparent'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="bg-[#FFB536] text-white border-none py-2 px-6 rounded-[25px] cursor-pointer font-['Irish_Grover'] text-[19.2px] transition-colors duration-300 ease-in-out disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#ff9900c7] max-[1024px]:py-[6.4px] max-[1024px]:px-[19.2px] max-[1024px]:text-[17.6px] max-md:py-[4.8px] max-md:px-4 max-md:text-base max-[440px]:py-[4.8px] max-[440px]:px-[12.8px] max-[440px]:text-[14.4px] max-[375px]:py-[4px] max-[375px]:px-[11.2px] max-[375px]:text-[13.6px]"
        >
          Next
        </button>
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
