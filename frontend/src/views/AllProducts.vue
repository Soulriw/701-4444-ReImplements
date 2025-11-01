<template>
  <div class="relative min-h-screen pt-[120px] bg-dark text-white">
    <!-- Divider -->
    <div class="w-4/5 h-0.5 bg-gold mx-auto my-10"></div>

    <!-- Stars Background -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #fff, transparent), radial-gradient(2px 2px at 40px 70px, #fff, transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent); background-repeat: repeat; background-size: 200px 100px;"></div>

    <!-- Page Header -->
    <div class="text-center py-8 relative z-10">
      <h1 class="text-gold text-4xl font-bold">All Magical Books</h1>
    </div>

    <!-- Category Filters -->
    <div class="relative z-10 my-8" v-if="categories.length > 0">
      <div class="flex flex-wrap justify-center gap-2 px-4">
        <div 
          v-for="category in categories" 
          :key="category.categoryID"
        >
          <div 
            class="px-4 py-2 bg-white/10 border border-white/20 rounded-[20px] cursor-pointer transition-all duration-300 text-white text-center"
            :class="{ 'bg-gold text-black border-gold': currentCategory === category.categoryID, 'hover:bg-white/20 hover:-translate-y-0.5': currentCategory !== category.categoryID }"
            @click="filterByCategory(category.categoryID)"
          >
            {{ category.categoryName }}
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid Section -->
    <div class="relative z-10 px-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center" id="allProductsGrid">
        <!-- Loading State -->
        <div v-if="loading" class="col-span-full text-center">
          <h2 class="text-gold">Loading magical collection...</h2>
        </div>
        
        <!-- No Results -->
        <div v-else-if="filteredBooks.length === 0" class="col-span-full text-center">
          <h2 class="text-gold">No books found in this category.</h2>
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
        class="px-4 py-2 bg-white/10 border border-white/20 rounded text-white cursor-pointer transition-all duration-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>
      <div class="flex gap-2">
        <div 
          v-for="page in totalPages" 
          :key="page"
          class="px-3 py-2 bg-white/10 border border-white/20 rounded text-white cursor-pointer transition-all duration-300 hover:bg-white/20"
          :class="{ 'bg-gold text-black border-gold': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </div>
      </div>
      <button 
        class="px-4 py-2 bg-white/10 border border-white/20 rounded text-white cursor-pointer transition-all duration-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
    
    <div class="w-4/5 h-0.5 bg-gold mx-auto my-10"></div>
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
      scrollToTop
    }
  }
}
</script>