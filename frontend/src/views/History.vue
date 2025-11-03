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
    <div class="relative z-[500]">
      <h1 class="text-[#FEC564] text-center mb-8 text-4xl lg:pt-20 lg:text-3xl lg:mb-6 md:pt-16 md:text-2xl md:mb-6 sm:text-2xl max-[480px]:pt-14 max-[480px]:text-xl max-[480px]:mb-5 max-[480px]:p-[8px] max-[375px]:pt-12 max-[375px]:text-lg max-[375px]:mb-4 max-[375px]:p-[6px]">Purchase History</h1>

       <!-- Divider line -->
    <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both lg:my-8 md:my-7 max-[480px]:my-6 max-[480px]:w-[90%] max-[375px]:my-4 max-[375px]:w-[95%]"></div>

    <!-- Summary Cards -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px] flex justify-between gap-5 flex-nowrap max-md:flex-col max-md:gap-4 max-md:px-[10px] max-[480px]:gap-3 max-[480px]:px-[8px] max-[375px]:gap-2 max-[375px]:px-[6px]">
      <div class="flex-1 bg-[rgba(45,26,71,0.8)] rounded-[10px] p-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center gap-[15px] max-md:flex-1 max-md:p-[12px] max-md:gap-[12px] max-md:w-full max-[480px]:p-[10px] max-[480px]:gap-[10px] max-[375px]:p-[8px] max-[375px]:gap-[8px]">
        <div class="bg-[#FEC564] w-[50px] h-[50px] rounded-full flex justify-center items-center max-md:w-[45px] max-md:h-[45px] max-[480px]:w-[40px] max-[480px]:h-[40px] max-[375px]:w-[35px] max-[375px]:h-[35px]">
          <i class="fas fa-book text-[24px] text-[#2D1A47] max-md:text-[20px] max-[480px]:text-[18px] max-[375px]:text-[16px]"></i>
        </div>
        <div class="flex-grow">
          <h3 class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-[5px] max-md:text-[16px] max-[480px]:text-[14px] max-[480px]:mb-[3px] max-[375px]:text-[12px]">Total Books</h3>
          <p class="text-white font-['Irish_Grover'] text-[24px] m-0 max-md:text-[20px] max-[480px]:text-[18px] max-[375px]:text-[16px]">{{ totalBooks }}</p>
        </div>
      </div>
      
      <div class="flex-1 bg-[rgba(45,26,71,0.8)] rounded-[10px] p-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center gap-[15px] max-md:flex-1 max-md:p-[12px] max-md:gap-[12px] max-md:w-full max-[480px]:p-[10px] max-[480px]:gap-[10px] max-[375px]:p-[8px] max-[375px]:gap-[8px]">
        <div class="bg-[#FEC564] w-[50px] h-[50px] rounded-full flex justify-center items-center max-md:w-[45px] max-md:h-[45px] max-[480px]:w-[40px] max-[480px]:h-[40px] max-[375px]:w-[35px] max-[375px]:h-[35px]">
          <i class="fas fa-coins text-[24px] text-[#2D1A47] max-md:text-[20px] max-[480px]:text-[18px] max-[375px]:text-[16px]"></i>
        </div>
        <div class="flex-grow">
          <h3 class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-[5px] max-md:text-[16px] max-[480px]:text-[14px] max-[480px]:mb-[3px] max-[375px]:text-[12px]">Total Revenue</h3>
          <p class="text-white font-['Irish_Grover'] text-[24px] m-0 max-md:text-[20px] max-[480px]:text-[18px] max-[375px]:text-[16px]">{{ totalRevenue }} G</p>
        </div>
      </div>
      
      <div class="flex-1 bg-[rgba(45,26,71,0.8)] rounded-[10px] p-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center gap-[15px] max-md:flex-1 max-md:p-[12px] max-md:gap-[12px] max-md:w-full max-[480px]:p-[10px] max-[480px]:gap-[10px] max-[375px]:p-[8px] max-[375px]:gap-[8px]">
        <div class="bg-[#FEC564] w-[50px] h-[50px] rounded-full flex justify-center items-center max-md:w-[45px] max-md:h-[45px] max-[480px]:w-[40px] max-[480px]:h-[40px] max-[375px]:w-[35px] max-[375px]:h-[35px]">
          <i class="fas fa-shopping-cart text-[24px] text-[#2D1A47] max-md:text-[20px] max-[480px]:text-[18px] max-[375px]:text-[16px]"></i>
        </div>
        <div class="flex-grow">
          <h3 class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-[5px] max-md:text-[16px] max-[480px]:text-[14px] max-[480px]:mb-[3px] max-[375px]:text-[12px]">Total Orders</h3>
          <p class="text-white font-['Irish_Grover'] text-[24px] m-0 max-md:text-[20px] max-[480px]:text-[18px] max-[375px]:text-[16px]">{{ totalOrders }}</p>
        </div>
      </div>
    </div>

    <!-- Divider line -->
    <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both lg:my-8 md:my-7 max-[480px]:my-6 max-[480px]:w-[90%] max-[375px]:my-4 max-[375px]:w-[95%]"></div>


    <!-- History Table -->
    <div class="text-black max-w-[1200px] mx-auto my-5 px-[15px] max-md:px-[10px] max-[480px]:px-[8px] max-[375px]:px-[6px]">
      <div v-if="loading" class="text-center py-8 text-gray-300 max-md:py-6 max-[480px]:py-4">
        <h4 class="text-[#FEC564] max-md:text-[18px] max-[480px]:text-[16px] max-[375px]:text-[14px]">Loading history...</h4>
      </div>
      
      <div v-else-if="filteredHistory.length === 0" class="text-center py-8 text-gray-300 max-md:py-6 max-[480px]:py-4">
        <h4 class="max-md:text-[18px] max-[480px]:text-[16px] max-[375px]:text-[14px]">No sales history found</h4>
      </div>
      
      <div v-else class="overflow-x-auto -mx-[15px] max-md:-mx-[10px] max-[480px]:-mx-[8px] max-[375px]:-mx-[6px] px-[15px] max-md:px-[10px] max-[480px]:px-[8px] max-[375px]:px-[6px]">
        <table class="w-full min-w-[600px] border-collapse bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.2)] relative max-md:min-w-[500px] max-[480px]:min-w-[400px] max-[480px]:text-[14px] max-[375px]:min-w-[350px] max-[375px]:text-[12px]">
          <thead>
            <tr>
              <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">ID</th>
              <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Book Name</th>
              <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Category</th>
              <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Quantity</th>
              <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Price</th>
              <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Total</th>
              <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Enchantment</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedHistory" :key="item.historyID">
              <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.historyID }}</td>
              <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.bookName }}</td>
              <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.categoryName }}</td>
              <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.quantity }}</td>
              <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.sellPrice }} G</td>
              <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ (item.sellPrice * item.quantity).toFixed(2) }} G</td>
              <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.enchantment || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredHistory.length > 0" class="flex justify-center items-center my-5 mx-auto gap-[10px] max-md:gap-[8px] max-md:my-4 max-[480px]:gap-[6px] max-[480px]:my-4 max-[375px]:gap-[4px] max-[375px]:my-3">
      <button 
        @click="previousPage"
        :disabled="currentPage === 1"
        class="bg-[#FEC564] text-[#2D1A47] border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed disabled:text-white hover:bg-[#FFD700] max-md:py-[6px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[5px] max-[480px]:px-3 max-[480px]:text-[12px] max-[480px]:rounded-[15px] max-[375px]:py-[4px] max-[375px]:px-2 max-[375px]:text-[11px]"
      >
        Previous
      </button>
      <div class="flex gap-[10px] max-md:gap-[8px] max-[480px]:gap-[6px] max-[375px]:gap-[4px]">
        <button 
          v-for="page in pageNumbers"
          :key="page"
          @click="currentPage = page"
          :class="[
            'w-[35px] h-[35px] flex justify-center items-center bg-transparent rounded-full cursor-pointer font-[\'Irish_Grover\'] transition-all duration-300 ease-in-out max-md:w-[30px] max-md:h-[30px] max-md:text-[14px] max-[480px]:w-[28px] max-[480px]:h-[28px] max-[480px]:text-[12px] max-[375px]:w-[26px] max-[375px]:h-[26px] max-[375px]:text-[11px]',
            currentPage === page ? 'bg-[#FEC564] text-white' : 'text-white'
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button 
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-[#FEC564] text-[#2D1A47] border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed disabled:text-white hover:bg-[#FFD700] max-md:py-[6px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[5px] max-[480px]:px-3 max-[480px]:text-[12px] max-[480px]:rounded-[15px] max-[375px]:py-[4px] max-[375px]:px-2 max-[375px]:text-[11px]"
      >
        Next
      </button>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'History',
  setup() {
    const history = ref([])
    const filteredHistory = ref([])
    const loading = ref(false)
    const filters = ref({
      startDate: '',
      endDate: ''
    })
    const currentPage = ref(1)
    const itemsPerPage = 10

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

    const totalBooks = computed(() => {
      return filteredHistory.value.reduce((total, item) => total + item.quantity, 0)
    })

    const totalOrders = computed(() => {
      return filteredHistory.value.length
    })

    const totalRevenue = computed(() => {
      return filteredHistory.value.reduce((total, item) => total + (item.sellPrice * item.quantity), 0).toFixed(2)
    })

    const averageOrderValue = computed(() => {
      if (totalOrders.value === 0) return 0
      return (totalRevenue.value / totalOrders.value).toFixed(2)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredHistory.value.length / itemsPerPage)
    })

    const pageNumbers = computed(() => {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    })

    const paginatedHistory = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredHistory.value.slice(start, end)
    })

    const fetchHistory = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/history')
        history.value = response.data
        filteredHistory.value = [...history.value]
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        loading.value = false
      }
    }

    const applyFilters = () => {
      let filtered = [...history.value]
      
      if (filters.value.startDate) {
        const startDate = new Date(filters.value.startDate)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdAt || new Date())
          return itemDate >= startDate
        })
      }
      
      if (filters.value.endDate) {
        const endDate = new Date(filters.value.endDate)
        endDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdAt || new Date())
          return itemDate <= endDate
        })
      }
      
      filteredHistory.value = filtered
      currentPage.value = 1
    }

    const resetFilters = () => {
      filters.value = {
        startDate: '',
        endDate: ''
      }
      filteredHistory.value = [...history.value]
      currentPage.value = 1
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      fetchHistory()
    })

    return {
      history,
      filteredHistory,
      loading,
      filters,
      currentPage,
      totalBooks,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalPages,
      pageNumbers,
      paginatedHistory,
      applyFilters,
      resetFilters,
      nextPage,
      previousPage,
      formatDate,
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
</style>