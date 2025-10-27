<template>
  <div class="category-page">
    <div class="stars"></div>
    
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">{{ categoryName }}</h1>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <h2 style="color: #FEC564;">Loading books...</h2>
      </div>

      <div v-else-if="categoryBooks.length === 0" class="no-results">
        <div class="no-results-content">
          <i class="fas fa-book fa-3x"></i>
          <h2>No books found</h2>
          <p>No books available in this category</p>
        </div>
      </div>

      <div v-else class="category-books">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 justify-content-center g-4">
          <div 
            v-for="book in categoryBooks" 
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
import axios from 'axios'
import BookItem from '../components/BookItem.vue'

export default {
  name: 'CategoryPage',
  components: {
    BookItem
  },
  setup() {
    const route = useRoute()
    const booksStore = useBooksStore()
    
    const categoryBooks = ref([])
    const categoryName = ref('')
    const loading = ref(false)

    const fetchCategoryBooks = async () => {
      const categoryId = route.params.id
      if (!categoryId) return

      loading.value = true

      try {
        // Fetch books for this category
        const [booksResponse, categoryResponse] = await Promise.all([
          axios.get(`/api/category/${categoryId}`),
          axios.get(`/api/categoryInfo/${categoryId}`)
        ])

        categoryBooks.value = booksResponse.data
        categoryName.value = categoryResponse.data.categoryName
      } catch (error) {
        console.error('Error fetching category books:', error)
        categoryBooks.value = []
        categoryName.value = 'Category'
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await booksStore.fetchPromotionBooks()
      await fetchCategoryBooks()
    })

    // Watch for route changes
    watch(() => route.params.id, () => {
      fetchCategoryBooks()
    })

    return {
      categoryBooks,
      categoryName,
      loading
    }
  }
}
</script>

<style scoped>
.category-page {
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

