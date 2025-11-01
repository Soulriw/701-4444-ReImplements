<template>
  <div class="py-8 min-h-[80vh] pt-[120px] relative">
    <div class="container mx-auto px-4 relative z-10">
      <div class="w-full">
        <h1 class="text-gold text-4xl mb-8 text-center">Search Results</h1>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <h2 class="text-gold">Searching...</h2>
      </div>

      <div v-else-if="searchResults.length === 0" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center text-gray-300">
          <i class="fas fa-search fa-3x text-gold mb-4"></i>
          <h2 class="text-gold mb-4">No books found</h2>
          <p class="text-gray-400">Try searching with different keywords</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
        <div 
          v-for="book in searchResults" 
          :key="book.bookID" 
          class="w-full"
        >
          <BookItem :book="book" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
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

    const performSearch = async () => {
      const query = route.query.q
      if (!query) {
        searchResults.value = []
        return
      }

      searchTerm.value = query
      loading.value = true

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
      searchTerm
    }
  }
}
</script>
