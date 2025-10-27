<template>
  <div class="book-item-container">
    <router-link :to="`/productDetail/${book.bookID}`" @click="handleClick" style="text-decoration: none; color: inherit;">
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
</template>

<script>
import { computed } from 'vue'
import { useBooksStore } from '../stores'

export default {
  name: 'BookItem',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  setup() {
    const booksStore = useBooksStore()
    const promotionBooks = computed(() => booksStore.promotionBooks || [])

    const hasDiscount = (book) => {
      return promotionBooks.value.some(promo => promo.bookID === book.bookID)
    }

    const getDiscountPercentage = (book) => {
      const promotionInfo = promotionBooks.value.find(promo => promo.bookID === book.bookID)
      if (promotionInfo && book.proPrice && book.price) {
        return Math.round((1 - book.proPrice / book.price) * 100)
      }
      return 0
    }

    const getDisplayPrice = (book) => {
      const promotionInfo = promotionBooks.value.find(promo => promo.bookID === book.bookID)
      return promotionInfo && book.proPrice ? book.proPrice : book.price
    }

    const handleClick = () => {
      console.log('Navigating to book detail:', book.bookID)
    }

    return {
      promotionBooks,
      hasDiscount,
      getDiscountPercentage,
      getDisplayPrice,
      handleClick
    }
  }
}
</script>

<style scoped>
.book-item-container {
  width: 100%;
}

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

