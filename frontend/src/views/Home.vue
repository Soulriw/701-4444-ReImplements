<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 20%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    <!-- Confetti dots background -->
    <div class="confetti-container fixed top-[70px] left-0 right-0 bottom-0 pointer-events-none z-0 overflow-hidden">
      <div 
        v-for="(dot, index) in confettiDots" 
        :key="index"
        class="confetti-dot absolute rounded-full"
        :style="{
          left: dot.x + '%',
          top: dot.y + '%',
          width: dot.size + 'px',
          height: dot.size + 'px',
          backgroundColor: '#FEC564',
          opacity: dot.opacity,
          animationDelay: dot.delay + 's'
        }"
      ></div>
    </div>
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500] pb-20 max-md:pb-16 max-[480px]:pb-12 max-[375px]:pb-10">
      
      <!-- Best Seller Books Section -->
      <div class="flex items-start justify-center gap-[200px] pt-[240px] mb-[50px] max-[1024px]:gap-12 max-[1024px]:pt-[230px] max-[768px]:gap-2.5 max-[768px]:pt-[210px] max-[768px]:mb-[40px] max-[480px]:gap-4 max-[480px]:pt-[180px] max-[480px]:mb-[30px] max-[440px]:gap-3 max-[440px]:pt-[170px] max-[440px]:mb-[25px] max-[375px]:gap-[15px] max-[375px]:pt-[160px] max-[375px]:mb-[20px]">
        
        <!-- 2nd Best Seller Book -->
        <div class="relative text-center z-[500] w-[250px] flex flex-col items-center max-[768px]:w-[190px] max-[480px]:w-[130px] max-[440px]:w-[110px] max-[375px]:w-[100px]">
          <router-link to="/productDetail/110" class="no-underline">
            <!-- Crown Image for 2nd Place -->
            <div class="absolute top-[-210px] left-1/2 -translate-x-1/2 w-[240px] max-[1024px]:top-[-185px] max-[1024px]:w-[210px] max-[768px]:top-[-150px] max-[768px]:w-[160px] max-[480px]:top-[-120px] max-[480px]:w-[130px] max-[440px]:top-[-105px] max-[440px]:w-[110px] max-[375px]:top-[-95px] max-[375px]:w-[95px]">
              <img src="/src/model/image/bestSeller/crown2.png" alt="2nd seller" class="w-full" />
            </div>

            <!-- Curved Text for 2nd Place -->
            <svg class="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[200px] h-[80px] max-[1024px]:top-[-90px] max-[1024px]:w-[200px] max-[1024px]:h-[75px] max-[768px]:top-[-80px] max-[768px]:w-[175px] max-[768px]:h-[60px] max-[480px]:top-[-70px] max-[480px]:w-[100px] max-[480px]:h-[40px] max-[440px]:top-[-65px] max-[440px]:w-[80px] max-[440px]:h-[35px] max-[375px]:top-[-60px] max-[375px]:w-[70px] max-[375px]:h-[30px]" viewBox="0 15 100 50">
              <path id="curve2" d="M10,40 Q50,30 90,40" fill="transparent"></path>
              <text text-anchor="middle">
                <textPath href="#curve2" startOffset="50%" fill="white" :font-size="isMobile ? 14 : 18" font-weight="bold" stroke="black" stroke-width="2" paint-order="stroke fill">
                  2nd Seller
                </textPath>
              </text>
            </svg>
            <img src="/src/model/image/bestSeller/B2.jpg" alt="Book II" class="w-[250px] mb-5 max-[1024px]:w-[225px] max-[768px]:w-[190px] max-[768px]:mb-4 max-[480px]:w-[130px] max-[480px]:mb-3 max-[440px]:w-[110px] max-[440px]:mb-2 max-[375px]:w-[100px] max-[375px]:mb-2" />
            <h1 class="w-full mt-1 text-[#FEC564] text-center text-[30px] max-[768px]:text-2xl max-[768px]:mt-0.5 max-[480px]:text-[18px] max-[440px]:text-[15px] max-[440px]:mt-0 max-[375px]:text-[13px]">Lost Spells and Forbidden Rituals</h1>
          </router-link>
        </div>

        <!-- 1st Best Seller Book (Center Position) -->
        <div class="relative text-center z-[500] w-[250px] flex flex-col items-center -translate-y-[50px] max-[768px]:-translate-y-[30px] max-[480px]:-translate-y-3 max-[440px]:-translate-y-2 max-[375px]:-translate-y-2 max-[768px]:w-[190px] max-[480px]:w-[130px] max-[440px]:w-[110px] max-[375px]:w-[100px]">
          <router-link to="/productDetail/301" class="no-underline">
            <!-- Crown Image for 1st Place -->
            <div class="absolute top-[-210px] left-1/2 -translate-x-1/2 w-[240px] max-[1024px]:top-[-185px] max-[1024px]:w-[210px] max-[768px]:top-[-150px] max-[768px]:w-[160px] max-[480px]:top-[-120px] max-[480px]:w-[130px] max-[440px]:top-[-105px] max-[440px]:w-[110px] max-[375px]:top-[-95px] max-[375px]:w-[95px]">
              <img src="/src/model/image/bestSeller/crown1.png" alt="1st seller" class="w-full" />
            </div>

            <!-- Curved Text for 1st Place -->
            <svg class="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[200px] h-[80px] max-[1024px]:top-[-90px] max-[1024px]:w-[200px] max-[1024px]:h-[75px] max-[768px]:top-[-80px] max-[768px]:w-[175px] max-[768px]:h-[60px] max-[480px]:top-[-70px] max-[480px]:w-[100px] max-[480px]:h-[40px] max-[440px]:top-[-65px] max-[440px]:w-[80px] max-[440px]:h-[35px] max-[375px]:top-[-60px] max-[375px]:w-[70px] max-[375px]:h-[30px]" viewBox="0 15 100 50">
              <path id="curve1" d="M10,40 Q50,30 90,40" fill="transparent"></path>
              <text text-anchor="middle">
                <textPath href="#curve1" startOffset="50%" fill="white" :font-size="isMobile ? 14 : 18" font-weight="bold" stroke="black" stroke-width="2" paint-order="stroke fill">
                  1st Seller
                </textPath>
              </text>
            </svg>
            <img src="/src/model/image/bestSeller/B3.png" alt="Book III" class="w-[250px] mb-5 max-[1024px]:w-[225px] max-[768px]:w-[190px] max-[768px]:mb-4 max-[480px]:w-[130px] max-[480px]:mb-3 max-[440px]:w-[110px] max-[440px]:mb-2 max-[375px]:w-[100px] max-[375px]:mb-2" />
            <h1 class="w-full mt-1 text-[#FEC564] text-center text-[30px] max-[768px]:text-2xl max-[768px]:mt-0.5 max-[480px]:text-[18px] max-[440px]:text-[15px] max-[440px]:mt-0 max-[375px]:text-[13px]">The Origins of Magic</h1>
          </router-link>
        </div>

        <!-- 3rd Best Seller Book -->
        <div class="relative text-center z-[500] w-[250px] flex flex-col items-center max-[768px]:w-[190px] max-[480px]:w-[130px] max-[440px]:w-[110px] max-[375px]:w-[100px]">
          <router-link to="/productDetail/201" class="no-underline">
            <!-- Crown Image for 3rd Place -->
            <div class="absolute top-[-210px] left-1/2 -translate-x-1/2 w-[240px] max-[1024px]:top-[-185px] max-[1024px]:w-[210px] max-[768px]:top-[-150px] max-[768px]:w-[160px] max-[480px]:top-[-120px] max-[480px]:w-[130px] max-[440px]:top-[-105px] max-[440px]:w-[110px] max-[375px]:top-[-95px] max-[375px]:w-[95px]">
              <img src="/src/model/image/bestSeller/crown3.png" alt="3rd seller" class="w-full" />
            </div>

            <!-- Curved Text for 3rd Place -->
            <svg class="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[200px] h-[80px] max-[1024px]:top-[-90px] max-[1024px]:w-[200px] max-[1024px]:h-[75px] max-[768px]:top-[-80px] max-[768px]:w-[175px] max-[768px]:h-[60px] max-[480px]:top-[-70px] max-[480px]:w-[100px] max-[480px]:h-[40px] max-[440px]:top-[-65px] max-[440px]:w-[80px] max-[440px]:h-[35px] max-[375px]:top-[-60px] max-[375px]:w-[70px] max-[375px]:h-[30px]" viewBox="0 15 100 50">
              <path id="curve3" d="M10,40 Q50,30 90,40" fill="transparent"></path>
              <text text-anchor="middle">
                <textPath href="#curve3" startOffset="50%" fill="white" :font-size="isMobile ? 14 : 18" font-weight="bold" stroke="black" stroke-width="2" paint-order="stroke fill">
                  3rd Seller
                </textPath>
              </text>
            </svg>
            <img src="/src/model/image/bestSeller/B1.png" alt="Book I" class="w-[250px] mb-5 max-[1024px]:w-[225px] max-[768px]:w-[190px] max-[768px]:mb-4 max-[480px]:w-[130px] max-[480px]:mb-3 max-[440px]:w-[110px] max-[440px]:mb-2 max-[375px]:w-[100px] max-[375px]:mb-2" />
            <h1 class="w-full mt-1 text-[#FEC564] text-center text-[30px] max-[768px]:text-2xl max-[768px]:mt-0.5 max-[480px]:text-[18px] max-[440px]:text-[15px] max-[440px]:mt-0 max-[375px]:text-[13px]">The Elementary Spell</h1>
          </router-link>
        </div>
      </div>

      <!-- Divider line -->
      <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both max-md:my-8 max-[480px]:my-6 max-[480px]:w-[90%] max-[375px]:my-5 max-[375px]:w-[95%]"></div>

      <!-- Promotion Books Section -->
      <template v-if="promotionBooks.length > 0">
        <!-- Section Header -->
        <div class="text-center z-[500]">
          <h1 class="text-[#FEC564] text-4xl pt-10 pb-10 max-md:text-3xl max-md:pt-8 max-md:pb-8 max-[480px]:text-2xl max-[480px]:pt-6 max-[480px]:pb-6 max-[375px]:text-xl max-[375px]:pt-5 max-[375px]:pb-5">Promotion Books</h1>
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
        <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both max-md:my-8 max-[480px]:my-6 max-[480px]:w-[90%] max-[375px]:my-5 max-[375px]:w-[95%]"></div>
      </template>

      <!-- Recommended Books Section -->
      <div class="text-center z-[500] max-md:px-4 max-[480px]:px-3 max-[375px]:px-2 mb-16 max-md:mb-12 max-[480px]:mb-10 max-[375px]:mb-8">
        <!-- Section Header -->
        <div class="mb-12 max-md:mb-10 max-[480px]:mb-8 max-[375px]:mb-6">
          <h1 class="text-[#FEC564] text-4xl pt-10 pb-10 max-md:text-3xl max-md:pt-8 max-md:pb-8 max-[480px]:text-2xl max-[480px]:pt-6 max-[480px]:pb-6 max-[375px]:text-xl max-[375px]:pt-5 max-[375px]:pb-5">Recommend</h1>
        </div>

        <!-- First Recommended Book -->
        <div class="flex items-end justify-center gap-[50px] h-[60vh] max-[1024px]:gap-[110px] max-[1024px]:h-[55vh] max-md:flex-col max-md:items-center max-md:h-auto max-md:gap-10 max-md:mt-14 max-[480px]:gap-8 max-[480px]:mt-10 max-[375px]:gap-6 max-[375px]:mt-8">
          <div class="text-center max-w-[520px] max-md:max-w-[90%] max-md:w-full max-[480px]:max-w-[95%] max-[440px]:max-w-[95%] max-[375px]:max-w-[98%]">
            <router-link to="/productDetail/302" class="no-underline text-inherit flex flex-col items-center">
              <img src="/src/model/image/recommendBook/R1.png" alt="Forbidden Spells" class="w-[360px] mb-10 mx-auto max-md:w-[300px] max-md:mb-8 max-[480px]:w-[280px] max-[480px]:mb-6 max-[440px]:w-[240px] max-[440px]:mb-5 max-[375px]:w-[220px] max-[375px]:mb-4" />
              <h3 class="text-[#FEC564] text-2xl font-semibold mb-2 text-center max-md:text-xl max-md:mb-2 max-[480px]:text-lg max-[480px]:mb-1.5 max-[440px]:text-base max-[375px]:text-sm">Forbidden Spells: The Dark Legacy of Magic</h3>
              <p class="text-white text-center text-base leading-relaxed max-w-[550px] mx-auto max-md:text-sm max-md:leading-relaxed max-md:px-4 max-md:max-w-full max-[480px]:text-xs max-[480px]:px-3 max-[440px]:text-xs max-[375px]:text-[11px] max-[375px]:px-2">
                This book uncovers the hidden history of forbidden spells and dark
                magic. It traces their origins, the ancient texts that held them,
                and the sorcerers who used these powerful, dangerous arts.
                Discover the dark legacy that has shaped magic through the ages
              </p>
            </router-link>
          </div>

          <!-- Second Recommended Book -->
          <div class="text-center max-w-[550px] max-md:max-w-[90%] max-md:w-full max-[480px]:max-w-[95%] max-[440px]:max-w-[95%] max-[375px]:max-w-[98%]">
            <router-link to="/productDetail/401" class="no-underline text-inherit flex flex-col items-center">
              <img src="/src/model/image/recommendBook/R2.png" alt="Dragon Love" class="w-[360px] mb-10 mx-auto max-md:w-[300px] max-md:mb-8 max-[480px]:w-[280px] max-[480px]:mb-6 max-[440px]:w-[240px] max-[440px]:mb-5 max-[375px]:w-[220px] max-[375px]:mb-4" />
              <h3 class="text-[#FEC564] text-2xl font-semibold mb-2 text-center max-md:text-xl max-md:mb-2 max-[480px]:text-lg max-[480px]:mb-1.5 max-[440px]:text-base max-[375px]:text-sm">Men Who Love Dragons Too Much</h3>
              <p class="text-white text-center text-base leading-relaxed max-w-[550px] mx-auto max-md:text-sm max-md:leading-relaxed max-md:px-4 max-md:max-w-full max-[480px]:text-xs max-[480px]:px-3 max-[440px]:text-xs max-[375px]:text-[11px] max-[375px]:px-2">
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
    <div @click="scrollToTop" class="fixed bottom-[30px] left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-500 invisible bg-black/70 rounded-full w-[50px] h-[50px] flex justify-center items-center cursor-pointer z-[1000] max-md:bottom-[25px] max-md:w-[45px] max-md:h-[45px] max-[480px]:bottom-[20px] max-[480px]:w-[40px] max-[480px]:h-[40px] max-[375px]:bottom-[15px] max-[375px]:w-[35px] max-[375px]:h-[35px]" :class="{ 'opacity-100 visible': showScrollButton }">
      <i class="fas fa-arrow-up text-[#FFD700] text-2xl max-md:text-xl max-[480px]:text-lg max-[375px]:text-base"></i>
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
    
    // Generate random confetti dots
    const generateConfettiDots = () => {
      const dots = []
      const dotCount = 80 // Number of confetti dots
      
      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * 100, // Random X position (0-100%)
          y: Math.random() * 100, // Random Y position (0-100%)
          size: Math.random() * 4 + 2, // Random size between 2-6px
          opacity: Math.random() * 0.6 + 0.3, // Random opacity between 0.3-0.9
          delay: Math.random() * 3 // Random animation delay
        })
      }
      
      return dots
    }
    
    const confettiDots = ref(generateConfettiDots())

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
      isMobile,
      confettiDots
    }
  }
}
</script>

<style scoped>
/* Confetti dots animation */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
}

.confetti-dot {
  animation: twinkle 3s ease-in-out infinite;
  box-shadow: 0 0 4px rgba(254, 197, 100, 0.5);
}

.confetti-container {
  z-index: 0;
}

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

