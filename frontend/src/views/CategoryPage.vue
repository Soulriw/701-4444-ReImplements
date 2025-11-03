<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 0%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Stars background animation layer -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #FEC564, transparent), radial-gradient(2px 2px at 40px 70px, #FEC564, transparent), radial-gradient(1px 1px at 90px 40px, #FEC564, transparent), radial-gradient(1px 1px at 130px 80px, #FEC564, transparent), radial-gradient(2px 2px at 160px 30px, #FEC564, transparent); background-size: 200px 100px;"></div>
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500] py-8 min-h-[80vh] pt-[20px]">
    
    <!-- Container - matching all-products-container from searchPage.css: padding 16px, max-width 1400px, margin auto -->
    <div class="mx-auto relative z-[500] p-4 max-w-[1400px]">
      <!-- Page Header - matching rec class styling from homePage.css: z-index 500, margin 20px -->
      <div class="w-full text-center z-[500]">
        <div class="mt-[20px] mb-[20px]">
          <h1 class="text-4xl text-[#FEC564] m-[20px]">{{ categoryName }}</h1>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <h2 class="text-[#FEC564]">Loading books...</h2>
      </div>

      <!-- Empty State -->
      <div v-else-if="categoryBooks.length === 0" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center text-white">
          <i class="fas fa-book fa-3x mb-4 text-[#FEC564]"></i>
          <h2 class="mb-4 text-[#FEC564]">No books found</h2>
          <p class="text-white">No books available in this category</p>
        </div>
      </div>

      <!-- Books Grid Container - matching all-products-container styling from searchPage.css -->
      <div v-else>
        <div class="pt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center">
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
/* Background is now handled in template */
</style>
