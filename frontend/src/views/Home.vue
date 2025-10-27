<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 0%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Stars background animation layer -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #FEC564, transparent), radial-gradient(2px 2px at 40px 70px, #FEC564, transparent), radial-gradient(1px 1px at 90px 40px, #FEC564, transparent), radial-gradient(1px 1px at 130px 80px, #FEC564, transparent), radial-gradient(2px 2px at 160px 30px, #FEC564, transparent); background-size: 200px 100px;"></div>
    
    <!-- Content with padding for navbar -->
    <div class="pt-[100px] relative z-[500]">
      
      <!-- Best Seller Books Section -->
      <div class="flex items-start justify-center gap-[200px] pt-[260px] mb-[50px] max-[1024px]:gap-12 max-[1024px]:pt-[230px] max-[768px]:gap-2.5 max-[768px]:pt-[210px] max-[440px]:gap-5 max-[440px]:pt-[190px] max-[375px]:gap-[15px] max-[375px]:pt-[180px]">
        
        <!-- 2nd Best Seller Book -->
        <div class="relative text-center z-[500] w-[250px] flex flex-col items-center max-[768px]:w-[190px] max-[440px]:w-[110px]">
          <router-link to="/productDetail/110" class="no-underline">
            <!-- Crown Image for 2nd Place -->
            <div class="absolute top-[-210px] left-1/2 -translate-x-1/2 w-[240px] max-[1024px]:top-[-185px] max-[1024px]:w-[210px] max-[768px]:top-[-150px] max-[768px]:w-[160px] max-[440px]:top-[-105px] max-[440px]:w-[110px] max-[375px]:top-[-95px] max-[375px]:w-[95px]">
              <img src="/src/model/image/bestSeller/crown2.png" alt="2nd seller" class="w-full" />
            </div>

            <!-- Curved Text for 2nd Place -->
            <svg class="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[200px] h-[80px] max-[1024px]:top-[-90px] max-[1024px]:w-[200px] max-[1024px]:h-[75px] max-[768px]:top-[-80px] max-[768px]:w-[175px] max-[768px]:h-[60px] max-[440px]:top-[-65px] max-[440px]:w-[80px] max-[440px]:h-[35px] max-[375px]:top-[-60px] max-[375px]:w-[70px] max-[375px]:h-[30px]" viewBox="0 15 100 50">
              <path id="curve2" d="M10,40 Q50,30 90,40" fill="transparent"></path>
              <text text-anchor="middle">
                <textPath href="#curve2" startOffset="50%" fill="white" :font-size="isMobile ? 14 : 18" font-weight="bold" stroke="black" stroke-width="2" paint-order="stroke fill">
                  2nd Seller
                </textPath>
              </text>
            </svg>
            <img src="/src/model/image/bestSeller/B2.jpg" alt="Book II" class="w-[250px] mb-5 max-[1024px]:w-[225px] max-[768px]:w-[190px] max-[440px]:w-[110px]" />
            <h1 class="w-full mt-1 text-[#FEC564] text-center text-[30px] max-[768px]:text-2xl max-[440px]:text-[15px] max-[375px]:text-[13px]">Lost Spells and Forbidden Rituals</h1>
          </router-link>
        </div>

        <!-- 1st Best Seller Book (Center Position) -->
        <div class="relative text-center z-[500] w-[250px] flex flex-col items-center -translate-y-[50px] max-[768px]:-translate-y-[30px] max-[440px]:-translate-y-5 max-[375px]:-translate-y-5 max-[768px]:w-[190px] max-[440px]:w-[110px]">
          <router-link to="/productDetail/301" class="no-underline">
            <!-- Crown Image for 1st Place -->
            <div class="absolute top-[-210px] left-1/2 -translate-x-1/2 w-[240px] max-[1024px]:top-[-185px] max-[1024px]:w-[210px] max-[768px]:top-[-150px] max-[768px]:w-[160px] max-[440px]:top-[-105px] max-[440px]:w-[110px] max-[375px]:top-[-95px] max-[375px]:w-[95px]">
              <img src="/src/model/image/bestSeller/crown1.png" alt="1st seller" class="w-full" />
            </div>

            <!-- Curved Text for 1st Place -->
            <svg class="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[200px] h-[80px] max-[1024px]:top-[-90px] max-[1024px]:w-[200px] max-[1024px]:h-[75px] max-[768px]:top-[-80px] max-[768px]:w-[175px] max-[768px]:h-[60px] max-[440px]:top-[-65px] max-[440px]:w-[80px] max-[440px]:h-[35px] max-[375px]:top-[-60px] max-[375px]:w-[70px] max-[375px]:h-[30px]" viewBox="0 15 100 50">
              <path id="curve1" d="M10,40 Q50,30 90,40" fill="transparent"></path>
              <text text-anchor="middle">
                <textPath href="#curve1" startOffset="50%" fill="white" :font-size="isMobile ? 14 : 18" font-weight="bold" stroke="black" stroke-width="2" paint-order="stroke fill">
                  1st Seller
                </textPath>
              </text>
            </svg>
            <img src="/src/model/image/bestSeller/B3.png" alt="Book III" class="w-[250px] mb-5 max-[1024px]:w-[225px] max-[768px]:w-[190px] max-[440px]:w-[110px]" />
            <h1 class="w-full mt-1 text-[#FEC564] text-center text-[30px] max-[768px]:text-2xl max-[440px]:text-[15px] max-[375px]:text-[13px]">The Origins of Magic</h1>
          </router-link>
        </div>

        <!-- 3rd Best Seller Book -->
        <div class="relative text-center z-[500] w-[250px] flex flex-col items-center max-[768px]:w-[190px] max-[440px]:w-[110px]">
          <router-link to="/productDetail/201" class="no-underline">
            <!-- Crown Image for 3rd Place -->
            <div class="absolute top-[-210px] left-1/2 -translate-x-1/2 w-[240px] max-[1024px]:top-[-185px] max-[1024px]:w-[210px] max-[768px]:top-[-150px] max-[768px]:w-[160px] max-[440px]:top-[-105px] max-[440px]:w-[110px] max-[375px]:top-[-95px] max-[375px]:w-[95px]">
              <img src="/src/model/image/bestSeller/crown3.png" alt="3rd seller" class="w-full" />
            </div>

            <!-- Curved Text for 3rd Place -->
            <svg class="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[200px] h-[80px] max-[1024px]:top-[-90px] max-[1024px]:w-[200px] max-[1024px]:h-[75px] max-[768px]:top-[-80px] max-[768px]:w-[175px] max-[768px]:h-[60px] max-[440px]:top-[-65px] max-[440px]:w-[80px] max-[440px]:h-[35px] max-[375px]:top-[-60px] max-[375px]:w-[70px] max-[375px]:h-[30px]" viewBox="0 15 100 50">
              <path id="curve3" d="M10,40 Q50,30 90,40" fill="transparent"></path>
              <text text-anchor="middle">
                <textPath href="#curve3" startOffset="50%" fill="white" :font-size="isMobile ? 14 : 18" font-weight="bold" stroke="black" stroke-width="2" paint-order="stroke fill">
                  3rd Seller
                </textPath>
              </text>
            </svg>
            <img src="/src/model/image/bestSeller/B1.png" alt="Book I" class="w-[250px] mb-5 max-[1024px]:w-[225px] max-[768px]:w-[190px] max-[440px]:w-[110px]" />
            <h1 class="w-full mt-1 text-[#FEC564] text-center text-[30px] max-[768px]:text-2xl max-[440px]:text-[15px] max-[375px]:text-[13px]">The Elementary Spell</h1>
          </router-link>
        </div>
      </div>

      <!-- Divider line -->
      <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both"></div>

      <!-- Promotion Books Section -->
      <template v-if="promotionBooks.length > 0">
        <!-- Section Header -->
        <div class="text-center z-[500]">
          <h1 class="text-[#FEC564] mb-5 max-[768px]:mb-3">Promotion Books</h1>
        </div>

        <!-- Promotion Books Grid -->
        <div class="p-8 max-w-[1600px] mx-auto z-[500] max-[1024px]:p-6 max-[768px]:p-4 max-[440px]:p-3.5 max-[375px]:p-2.5">
          <div class="grid grid-cols-2 gap-4 max-xl:grid-cols-5 max-lg:grid-cols-2 justify-center">
            <div v-for="book in firstPageBooks" :key="book.bookID">
              <BookItem :book="book" />
            </div>
          </div>
        </div>

        <!-- Divider line -->
        <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both"></div>
      </template>

      <!-- Recommended Books Section -->
      <div class="text-center z-[500]">
        <!-- Section Header -->
        <div class="mb-12">
          <h1 class="text-[#FEC564] text-5xl max-[768px]:text-4xl max-[440px]:text-3xl">Recommend</h1>
        </div>

        <!-- First Recommended Book -->
        <div class="flex items-end justify-center gap-[50px] h-[60vh] max-[1024px]:gap-[110px] max-[768px]:flex-col max-[768px]:h-auto max-[768px]:gap-10 max-[768px]:mt-14">
          <div class="text-center max-w-[520px] max-[768px]:max-w-[340px] max-[440px]:max-w-[280px] max-[375px]:max-w-[240px]">
            <router-link to="/productDetail/302" class="no-underline text-inherit flex flex-col items-center">
              <img src="/src/model/image/recommendBook/R1.png" alt="Forbidden Spells" class="w-[360px] mb-10 mx-auto max-[768px]:w-[300px] max-[440px]:w-[260px] max-[375px]:w-[240px]" />
              <h3 class="text-[#FEC564] text-2xl font-semibold mb-2 text-center max-[440px]:text-xl">Forbidden Spells: The Dark Legacy of Magic</h3>
              <p class="text-white text-center text-base leading-relaxed max-w-[550px] mx-auto max-[440px]:text-sm px-4">
                This book uncovers the hidden history of forbidden spells and dark
                magic. It traces their origins, the ancient texts that held them,
                and the sorcerers who used these powerful, dangerous arts.
                Discover the dark legacy that has shaped magic through the ages
              </p>
            </router-link>
          </div>

          <!-- Second Recommended Book -->
          <div class="text-center max-w-[550px] max-[768px]:max-w-[340px] max-[440px]:max-w-[280px] max-[375px]:max-w-[240px]">
            <router-link to="/productDetail/401" class="no-underline text-inherit flex flex-col items-center">
              <img src="/src/model/image/recommendBook/R2.png" alt="Dragon Love" class="w-[360px] mb-10 mx-auto max-[768px]:w-[300px] max-[440px]:w-[260px] max-[375px]:w-[240px]" />
              <h3 class="text-[#FEC564] text-2xl font-semibold mb-2 text-center max-[440px]:text-xl">Men Who Love Dragons Too Much</h3>
              <p class="text-white text-center text-base leading-relaxed max-w-[550px] mx-auto max-[440px]:text-sm px-4">
                The story of a old wizard who falls in forbidden love with a
                dragon. Their passionate, illicit relationship defies the laws of
                nature and society, forcing them to fight both internal and
                external battles to protect a love that seems impossible in a
                world full of opposition and conflict.
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Up Button -->
    <div @click="scrollToTop" class="fixed bottom-[30px] left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-500 invisible bg-black/70 rounded-full w-[50px] h-[50px] flex justify-center items-center cursor-pointer z-[1000]" :class="{ 'opacity-100 visible': showScrollButton }">
      <i class="fas fa-arrow-up text-[#FFD700] text-2xl"></i>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useBooksStore } from '../stores'
import BookItem from '../components/BookItem.vue'

export default {
  name: 'Home',
  components: {
    BookItem
  },
  setup() {
    const booksStore = useBooksStore()
    const itemsPerPage = 5
    const showScrollButton = ref(false)
    const isMobile = ref(window.innerWidth <= 440)

    const promotionBooks = computed(() => booksStore.promotionBooks || [])
    const firstPageBooks = computed(() => {
      if (!promotionBooks.value || promotionBooks.value.length === 0) {
        return []
      }
      return promotionBooks.value.slice(0, itemsPerPage)
    })

    // Scroll to top function
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    // Check if scroll button should be visible
    const handleScroll = () => {
      showScrollButton.value = window.scrollY > 300
    }

    onMounted(async () => {
      try {
        await booksStore.fetchPromotionBooks()
      } catch (error) {
        console.error('Error fetching promotion books:', error)
      }

      // Add scroll event listener
      window.addEventListener('scroll', handleScroll)
      
      // Check if mobile on mount
      const checkMobile = () => {
        isMobile.value = window.innerWidth <= 440
      }
      window.addEventListener('resize', checkMobile)
    })

    return {
      promotionBooks,
      firstPageBooks,
      scrollToTop,
      showScrollButton,
      isMobile
    }
  }
}
</script>

<style scoped>
/* Custom styles for Tailwind compatibility */
/* Note: Most styles are now handled by Tailwind classes */

/* CSS custom properties for stars animation timing */
:root {
  --duration: 2s;
}

/* Animation for scroll button visibility */
@keyframes fadeIn {
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
}
</style>

