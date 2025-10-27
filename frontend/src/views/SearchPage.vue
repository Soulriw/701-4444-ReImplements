<template>
  <div class="search-page">
    <div class="stars"></div>
    
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">Search Results</h1>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <h2 style="color: #FEC564;">Searching...</h2>
      </div>

      <div v-else-if="searchResults.length === 0" class="no-results">
        <div class="no-results-content">
          <i class="fas fa-search fa-3x"></i>
          <h2>No books found</h2>
          <p>Try searching with different keywords</p>
        </div>
      </div>

      <div v-else class="search-results">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 justify-content-center g-4">
          <div 
            v-for="book in searchResults" 
            :key="book.bookID" 
            class="col-6 col-lg"
          >
            <BookItem :book="book" />
          </div>
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

<style scoped>
.search-page {
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

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.no-results-content {
  text-align: center;
  color: #ccc;
}

.no-results-content i {
  color: #FEC564;
  margin-bottom: 1rem;
}

.no-results-content h2 {
  color: #FEC564;
  margin-bottom: 1rem;
}

.no-results-content p {
  color: #888;
}
</style>

