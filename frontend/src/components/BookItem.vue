<template>
  <!-- Book item card container -->
  <div class="w-full">
    <router-link :to="`/productDetail/${book.bookID}`" @click="handleClick" class="no-underline text-inherit">
      <div class="bg-white/5 border border-white/10 rounded-[15px] p-4 transition-all duration-300 relative overflow-hidden h-full flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(254,197,100,0.3)] hover:border-[#FEC564]">
        <!-- Discount label badge -->
        <div v-if="hasDiscount(book)" class="absolute top-[15px] right-[15px] bg-[#FEC564] text-black py-2 px-4 rounded-[20px] font-bold text-xl z-10 max-[1024px]:text-lg max-[768px]:text-base max-[440px]:top-[10px] max-[440px]:right-[10px] max-[440px]:py-1.5 max-[440px]:px-3 max-[375px]:text-sm">
          {{ getDiscountPercentage(book) }}%
        </div>
        <img 
          :src="`/src/model/image/books/${book.bookID}.jpg`" 
          :alt="book.bookName" 
          class="w-full h-auto rounded-[10px] mb-4"
          @error="$event.target.src='/src/model/image/books/default.jpg'"
        />
        <h2 class="text-[#FEC564] text-xl mb-2 font-bold max-[1024px]:text-lg max-[768px]:text-base">{{ book.bookName }}</h2>
        <p class="text-gray-300 text-sm mb-4 flex-grow overflow-hidden text-ellipsis line-clamp-2 max-[1024px]:text-xs max-[768px]:text-xs">{{ book.bookDescription || 'No description available.' }}</p>
        <div class="flex items-center gap-4 mt-auto">
          <span v-if="hasDiscount(book)" class="text-gray-400 line-through text-base max-[440px]:text-sm">{{ book.price }}</span>
          <span class="text-[#FEC564] text-xl font-bold max-[440px]:text-base">{{ getDisplayPrice(book) }} G</span>
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
/* Styles now handled by Tailwind classes */
</style>

