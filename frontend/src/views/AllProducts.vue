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
          <router-link :to="`/productDetail?id=${book.bookID}`" class="book-link" style="text-decoration: none; color: inherit;">
            <div class="search-card">
              <div v-if="hasDiscount(book)" class="search-discount-label">
                {{ getDiscountPercentage(book) }}%
              </div>
              <img 
                :src="`/src/model/image/books/${book.bookID}.jpg`" 
                :alt="book.bookName" 
                @error="$event.target.src='/src/model/image/books/default.jpg'"
              />
              <h2>{{ book.bookName }}</h2>
              <p>{{ book.bookDescription || 'No description available.' }}</p>
              <div class="search-price-tag">
                <span v-if="hasDiscount(book)" class="search-original-price">{{ book.price }}</span>
                <span class="search-promo-price">{{ getDisplayPrice(book) }} G</span>
              </div>
            </div>
          </router-link>
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

export default {
  name: 'AllProducts',
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

    const hasDiscount = (book) => {
      return promotionBooks.value.some(promo => promo.bookID === book.bookID)
    }

    const getDiscountPercentage = (book) => {
      const promotionInfo = promotionBooks.value.find(promo => promo.bookID === book.bookID)
      if (promotionInfo) {
        return Math.round((1 - book.proPrice / book.price) * 100)
      }
      return 0
    }

    const getDisplayPrice = (book) => {
      const promotionInfo = promotionBooks.value.find(promo => promo.bookID === book.bookID)
      return promotionInfo ? book.proPrice : book.price
    }

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
      hasDiscount,
      getDiscountPercentage,
      getDisplayPrice,
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
</style>

