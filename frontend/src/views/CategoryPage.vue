<template>
  <div class="py-8 min-h-[80vh] pt-[120px] relative">
    <div class="fixed inset-0 pointer-events-none z-0 bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #fff, transparent), radial-gradient(2px 2px at 40px 70px, #fff, transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent); background-repeat: repeat; background-size: 200px 100px;"></div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="w-full">
        <h1 class="text-gold text-4xl mb-8 text-center">{{ categoryName }}</h1>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <h2 class="text-gold">Loading books...</h2>
      </div>

      <div v-else-if="categoryBooks.length === 0" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center text-gray-300">
          <i class="fas fa-book fa-3x text-gold mb-4"></i>
          <h2 class="text-gold mb-4">No books found</h2>
          <p class="text-gray-400">No books available in this category</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
        <div 
          v-for="book in categoryBooks" 
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
