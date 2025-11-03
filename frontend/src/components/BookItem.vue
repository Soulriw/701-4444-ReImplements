<template>
  <!-- Book item card container -->
  <div class="w-full">
    <router-link :to="`/productDetail/${book.bookID}`" @click="handleClick" class="no-underline text-inherit">
      <div class="bg-white rounded-[20px] p-[12.8px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-all duration-300 relative flex flex-col h-full z-[500] max-w-[280px] mx-auto cursor-pointer hover:-translate-y-[10px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] max-[1024px]:max-w-[250px] max-md:max-w-[220px] max-md:p-[11.2px] max-[440px]:max-w-[180px] max-[440px]:p-[9.6px] max-[375px]:max-w-[160px] max-[375px]:p-[8px]">
        <!-- Discount label badge -->
        <div v-if="hasDiscount(book)" class="absolute -top-[8px] -right-[8px] bg-[#ff0000] text-white py-[6.4px] px-[12.8px] rounded-[15px] font-bold text-[19.2px] z-[1] shadow-[0_2px_4px_rgba(0,0,0,0.2)] max-[1024px]:text-[17.6px] max-md:text-base max-md:py-[4.8px] max-md:px-[9.6px] max-[440px]:text-[14.4px] max-[440px]:py-[4.8px] max-[440px]:px-[8px] max-[440px]:-top-[5px] max-[440px]:-right-[5px] max-[375px]:text-[14.4px]" style="font-family: 'Irish Grover', cursive;">
          {{ getDiscountPercentage(book) }}%
        </div>
        <img 
          :src="`/src/model/image/books/${book.bookID}.jpg`" 
          :alt="book.bookName" 
          class="w-full h-[180px] object-cover rounded-[10px] mb-0 max-[1024px]:h-[160px] max-md:h-[140px] max-[440px]:h-[120px] max-[375px]:h-[110px]"
          @error="$event.target.src='/src/model/image/books/default.jpg'"
        />
        <h2 class="text-[#2a1b3d] mt-[12.8px] mb-[12.8px] text-base leading-[1.2] h-[2.4em] overflow-hidden max-[1024px]:text-[15.2px] max-md:text-[14.4px] max-md:mt-[9.6px] max-md:mb-[9.6px] max-[440px]:text-[13.6px] max-[440px]:mt-[8px] max-[440px]:mb-[8px] max-[440px]:h-[2.2em] max-[375px]:text-[12.8px] max-[375px]:h-[2em]">{{ book.bookName }}</h2>
        <p class="text-[#666] text-[13.6px] mb-[12.8px] line-clamp-3 h-[4.0em] overflow-hidden max-md:text-[12.8px] max-[440px]:text-[12px] max-[440px]:h-[3.6em] max-[375px]:text-[11.2px] max-[375px]:h-[3.2em]" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
          {{ book.bookDescription || 'No description available.' }}
        </p>
        <div class="flex gap-[12.8px] items-center justify-end mt-auto pt-[8px] max-[440px]:gap-2 max-[440px]:pt-[4.8px] max-[375px]:pt-[4.8px]">
          <span v-if="hasDiscount(book)" class="text-[#999] line-through text-[14.4px] max-[440px]:text-[12.8px] max-[375px]:text-[12px]">{{ book.price }}</span>
          <span class="text-[#ff4444] text-[17.6px] font-bold max-[440px]:text-[14.4px] max-[375px]:text-[13.6px]">{{ getDisplayPrice(book) }} G</span>
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