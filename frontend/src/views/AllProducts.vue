<template>
  <div class="home-page">
    <!-- Divider -->
    <div class="divider"></div>

    <!-- Stars Background -->
    <div class="stars"></div>

    <!-- Page Header -->
    <div class="row text-center">
      <div class="col-12 text-center rec">
        <br>
        <br>
        <h1>All Magical Books</h1>
      </div>
    </div>

    <!-- Category Filters -->
    <div class="category-filters" v-if="categories.length > 0">
      <div class="row justify-content-center g-2">
        <div 
          v-for="category in categories" 
          :key="category.categoryID"
          class="col-auto"
        >
          <div 
            class="category-card"
            :class="{ active: currentCategory === category.categoryID }"
            @click="filterByCategory(category.categoryID)"
          >
            {{ category.categoryName }}
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid Section -->
    <div class="all-products-container">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 justify-content-center g-4" id="allProductsGrid">
        <!-- Loading State -->
        <div v-if="loading" class="col-12 text-center">
          <h2 style="color: #FEC564;">Loading magical collection...</h2>
        </div>
        
        <!-- No Results -->
        <div v-else-if="filteredBooks.length === 0" class="col-12 text-center">
          <h2 style="color: #FEC564;">No books found in this category.</h2>
        </div>
        
        <!-- Books Grid -->
        <div 
          v-else
          v-for="book in currentPageBooks" 
          :key="book.bookID" 
          class="col-6 col-lg"
        >
          <BookItem :book="book" />
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container">
      <button 
        class="pagination-btn prev-btn" 
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>
      <div class="page-numbers">
        <div 
          v-for="page in totalPages" 
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </div>
      </div>
      <button 
        class="pagination-btn next-btn" 
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
    
    <div class="divider"></div>
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

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  padding-top: 120px;
  background-color: #0a0a0a;
  color: #ffffff;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}

.all-products-container {
  position: relative;
  z-index: 1;
  padding: 0 2rem;
}

.category-filters {
  margin: 2rem 0;
}

.category-card {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-align: center;
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.category-card.active {
  background: #FEC564;
  color: #000;
  border-color: #FEC564;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number:hover {
  background: rgba(255, 255, 255, 0.2);
}

.page-number.active {
  background: #FEC564;
  color: #000;
  border-color: #FEC564;
}

/* Search card styling */
.search-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(254, 197, 100, 0.3);
  border-color: #FEC564;
}

.search-card img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.search-card h2 {
  color: #FEC564;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.search-card p {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search-discount-label {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #FEC564;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.2rem;
  z-index: 10;
}

.search-price-tag {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.search-original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1rem;
}

.search-promo-price {
  color: #FEC564;
  font-size: 1.3rem;
  font-weight: bold;
}
</style>

