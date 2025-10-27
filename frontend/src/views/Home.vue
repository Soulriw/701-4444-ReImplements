<template>
  <div class="home-page">
    <!-- Stars Background -->
    <div class="stars" :style="starsStyle"></div>

    <!-- Best Seller Books -->
    <div class="container d-flex justify-content-center align-items-end book-container">
      <!-- 2nd Best Seller Book -->
      <div class="book">
        <router-link to="/productDetail/110" style="text-decoration: none">
          <!-- Crown Image for 2nd Place -->
          <div class="crown">
            <img src="/src/model/image/bestSeller/crown2.png" alt="2nd seller" />
          </div>

          <!-- Curved Text for 2nd Place -->
          <svg class="crown-text" viewBox="0 15 100 50">
            <path id="curve2" d="M10,40 Q50,30 90,40" fill="transparent"></path>
            <text text-anchor="middle">
              <textPath href="#curve2" startOffset="50%" fill="white" font-size="18" font-weight="bold">
                2nd Seller
              </textPath>
            </text>
          </svg>
          <img src="/src/model/image/bestSeller/B2.jpg" alt="Book II" />
          <h1 class="text-book">Lost Spells and Forbidden Rituals</h1>
        </router-link>
      </div>

      <!-- 1st Best Seller Book (Center Position) -->
      <div class="book center">
        <router-link to="/productDetail/301" style="text-decoration: none">
          <!-- Crown Image for 1st Place -->
          <div class="crown">
            <img src="/src/model/image/bestSeller/crown1.png" alt="1st seller" />
          </div>

          <!-- Curved Text for 1st Place -->
          <svg class="crown-text" viewBox="0 15 100 50">
            <path id="curve1" d="M10,40 Q50,30 90,40" fill="transparent"></path>
            <text text-anchor="middle">
              <textPath href="#curve1" startOffset="50%" fill="white" font-size="18" font-weight="bold">
                1st Seller
              </textPath>
            </text>
          </svg>
          <img src="/src/model/image/bestSeller/B3.png" alt="Book III" />
          <h1 class="text-book">The Origins of Magic</h1>
        </router-link>
      </div>

      <!-- 3rd Best Seller Book -->
      <div class="book">
        <router-link to="/productDetail/201" style="text-decoration: none">
          <!-- Crown Image for 3rd Place -->
          <div class="crown">
            <img src="/src/model/image/bestSeller/crown3.png" alt="3rd seller" />
          </div>

          <!-- Curved Text for 3rd Place -->
          <svg class="crown-text" viewBox="0 15 100 50">
            <path id="curve3" d="M10,40 Q50,30 90,40" fill="transparent"></path>
            <text text-anchor="middle">
              <textPath href="#curve3" startOffset="50%" fill="white" font-size="18" font-weight="bold">
                3rd Seller
              </textPath>
            </text>
          </svg>
          <img src="/src/model/image/bestSeller/B1.png" alt="Book I" />
          <h1 class="text-book">The Elementary Spell</h1>
        </router-link>
      </div>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Promotion Books Section -->
    <template v-if="promotionBooks.length > 0">
      <!-- Section Header -->
      <div class="row text-center">
        <div class="col-12 text-center rec">
          <h1>Promotion Books</h1>
        </div>
      </div>

      <!-- Promotion Books Grid -->
      <div class="promotion-container">
        <div class="row row-cols-2 row-cols-xl-5 justify-content-center g-4">
          <div 
            v-for="book in firstPageBooks" 
            :key="book.bookID" 
            class="col-6 col-lg"
          >
            <BookItem :book="book" />
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>
    </template>

    <!-- Recommended Books -->
    <div class="container d-flex justify-content-center align-items-end rec-comtainer">
      <div class="row text-center">
        <!-- Section Header -->
        <div class="col-sm-12 text-center rec">
          <h1>Recommend</h1>
          <br />
        </div>

        <!-- First Recommended Book -->
        <div class="col-sm-12 col-lg-6 rec">
          <router-link to="/productDetail/302" style="text-decoration: none; color: inherit">
            <img src="/src/model/image/recommendBook/R1.png" alt="quad" class="img-fluid" />
            <br />
            <br />
            <h3>Forbidden Spells: The Dark Legacy of Magic</h3>
            <p>
              This book uncovers the hidden history of forbidden spells and dark
              magic. It traces their origins, the ancient texts that held them,
              and the sorcerers who used these powerful, dangerous arts.
              Discover the dark legacy that has shaped magic through the ages
            </p>
          </router-link>
        </div>

        <!-- Second Recommended Book -->
        <div class="col-sm-12 col-lg-6 rec">
          <router-link to="/productDetail/401" style="text-decoration: none; color: inherit">
            <img src="/src/model/image/recommendBook/R2.png" alt="quad" class="img-fluid" />
            <br />
            <br />
            <h3>Men Who Love Dragons Too Much</h3>
            <p>
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

    <!-- Scroll Up Button -->
    <div class="back-to-top" @click="scrollToTop">
      <i class="fas fa-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
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

    const promotionBooks = computed(() => booksStore.promotionBooks || [])
    const firstPageBooks = computed(() => {
      if (!promotionBooks.value || promotionBooks.value.length === 0) {
        return []
      }
      return promotionBooks.value.slice(0, itemsPerPage)
    })

    const starsStyle = {
      backgroundImage: `
        radial-gradient(2px 2px at 20px 30px, #fff, transparent),
        radial-gradient(2px 2px at 40px 70px, #fff, transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
        radial-gradient(1px 1px at 130px 80px, #fff, transparent),
        radial-gradient(2px 2px at 160px 30px, #fff, transparent)
      `,
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 100px',
      animation: 'sparkle 20s linear infinite'
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    onMounted(async () => {
      try {
        await booksStore.fetchPromotionBooks()
      } catch (error) {
        console.error('Error fetching promotion books:', error)
      }
    })

    return {
      promotionBooks,
      firstPageBooks,
      scrollToTop,
      starsStyle
    }
  }
}
</script>

<style scoped>
/* Home Page Styles */
.home-page {
  position: relative;
  min-height: 100vh;
  padding-top: 100px;
  background-color: #0a0a0a;
  color: #ffffff;
}

/* Stars Background Animation */
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

/* Book Container */
.book-container {
  position: relative;
  z-index: 1;
  padding: 2rem 0;
  margin-top: 2rem;
}

/* Individual Book */
.book {
  position: relative;
  text-align: center;
  transition: transform 0.3s ease;
  margin: 0 20px;
}

.book:hover {
  transform: translateY(-10px);
}

.book img {
  width: 100%;
  max-width: 300px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.book.center {
  z-index: 2;
  transform: scale(1.1);
}

/* Crown */
.crown {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.crown img {
  width: 80px;
  height: auto;
}

/* Crown Text SVG */
.crown-text {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 50px;
  z-index: 11;
}

/* Book Title */
.text-book {
  color: #FEC564;
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

/* Divider */
.divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #FEC564, transparent);
  margin: 4rem 0;
}

/* Recommendation Section */
.rec {
  text-align: center;
  padding: 2rem 0;
}

.rec h1 {
  color: #FEC564;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.rec h3 {
  color: #FEC564;
  margin-bottom: 1rem;
}

.rec p {
  color: #ccc;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Promotion Container */
.promotion-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Book Card */
.book-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(254, 197, 100, 0.3);
  border-color: #FEC564;
}

.book-card img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.book-card h2 {
  color: #FEC564;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.book-card p {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* Discount Label */
.discount-label {
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

/* Price Tag */
.price-tag {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1rem;
}

.promo-price {
  color: #FEC564;
  font-size: 1.3rem;
  font-weight: bold;
}

/* Recommended Container */
.rec-comtainer {
  padding: 2rem 0;
}

.rec-comtainer img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
}

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #FEC564;
  color: #000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 5px 15px rgba(254, 197, 100, 0.3);
}

.back-to-top:hover {
  background: #ffd700;
  transform: translateY(-5px);
}

.back-to-top i {
  font-size: 1.5rem;
}

@keyframes sparkle {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .book-container {
    flex-direction: column;
    align-items: center;
  }
  
  .book {
    margin: 1rem 0;
  }
  
  .book.center {
    transform: scale(1);
  }
  
  .rec h1 {
    font-size: 2rem;
  }
  
  .promotion-container {
    padding: 1rem;
  }
}
</style>

