<template>
  <div>
    <!-- Filter Section -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px]">
      <div class="flex flex-wrap justify-center gap-[15px] p-[15px] bg-[rgba(45,26,71,0.8)] rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] max-md:flex-col max-md:items-stretch">
        <div class="flex items-center gap-[10px] max-md:justify-between">
          <label class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-0 max-md:text-[16px]">From:</label>
          <input 
            type="date" 
            v-model="filters.startDate"
            class="py-[8px] px-3 border border-[#452667] bg-[#3D2657] text-white rounded-[5px] font-['Irish_Grover']"
          />
        </div>
        <div class="flex items-center gap-[10px] max-md:justify-between">
          <label class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-0 max-md:text-[16px]">To:</label>
          <input 
            type="date" 
            v-model="filters.endDate"
            class="py-[8px] px-3 border border-[#452667] bg-[#3D2657] text-white rounded-[5px] font-['Irish_Grover']"
          />
        </div>
        <div class="flex items-center gap-[10px]">
          <button 
            @click="applyFilters"
            class="bg-[#FEC564] text-[#2D1A47] border-none py-2 px-5 rounded-[5px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out hover:bg-[#FFD700] hover:-translate-y-0.5"
          >
            Filter
          </button>
          <button 
            @click="resetFilters"
            class="bg-[#666] text-white border-none py-2 px-5 rounded-[5px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out hover:bg-[#888]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px] flex justify-between flex-wrap gap-5 max-[992px]:[&>*]:flex-[1_1_calc(50%-20px)] max-md:[&>*]:flex-[1_1_100%]">
      <div class="flex-[1_1_calc(33.333%-20px)] min-w-[250px] bg-[rgba(45,26,71,0.8)] rounded-[10px] p-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center gap-[15px]">
        <div class="bg-[#FEC564] w-[50px] h-[50px] rounded-full flex justify-center items-center">
          <i class="fas fa-book text-[24px] text-[#2D1A47]"></i>
        </div>
        <div class="flex-grow">
          <h3 class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-[5px] max-[480px]:text-[16px]">Total Books</h3>
          <p class="text-white font-['Irish_Grover'] text-[24px] m-0 max-[480px]:text-[20px]">{{ totalBooks }}</p>
        </div>
      </div>
      
      <div class="flex-[1_1_calc(33.333%-20px)] min-w-[250px] bg-[rgba(45,26,71,0.8)] rounded-[10px] p-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center gap-[15px]">
        <div class="bg-[#FEC564] w-[50px] h-[50px] rounded-full flex justify-center items-center">
          <i class="fas fa-shopping-cart text-[24px] text-[#2D1A47]"></i>
        </div>
        <div class="flex-grow">
          <h3 class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-[5px] max-[480px]:text-[16px]">Total Orders</h3>
          <p class="text-white font-['Irish_Grover'] text-[24px] m-0 max-[480px]:text-[20px]">{{ totalOrders }}</p>
        </div>
      </div>
      
      <div class="flex-[1_1_calc(33.333%-20px)] min-w-[250px] bg-[rgba(45,26,71,0.8)] rounded-[10px] p-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center gap-[15px]">
        <div class="bg-[#FEC564] w-[50px] h-[50px] rounded-full flex justify-center items-center">
          <i class="fas fa-coins text-[24px] text-[#2D1A47]"></i>
        </div>
        <div class="flex-grow">
          <h3 class="text-[#FEC564] font-['Irish_Grover'] text-[18px] mb-[5px] max-[480px]:text-[16px]">Total Revenue</h3>
          <p class="text-white font-['Irish_Grover'] text-[24px] m-0 max-[480px]:text-[20px]">{{ totalRevenue }} G</p>
        </div>
      </div>
    </div>

    <!-- History Table -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px] overflow-x-auto">
      <div v-if="loading" class="text-center py-8 text-gray-300">
        <h4 class="text-[#FEC564]">Loading history...</h4>
      </div>
      
      <div v-else-if="filteredHistory.length === 0" class="text-center py-8 text-gray-300">
        <h4>No sales history found</h4>
      </div>
      
      <table v-else class="w-full border-collapse bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.2)] relative max-[480px]:text-[14px]">
        <thead>
          <tr>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">ID</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">Book Name</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">Category</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">Quantity</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">Price</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">Enchantment</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">Total</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-[480px]:text-[16px]">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedHistory" :key="item.historyID">
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.historyID }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.bookName }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.categoryName }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.quantity }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.sellPrice }} G</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ item.enchantment || '-' }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ (item.sellPrice * item.quantity).toFixed(2) }} G</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedHistory.length - 1 }">{{ formatDate(item.createdAt || new Date()) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredHistory.length > 0" class="flex justify-center items-center my-5 mx-auto gap-[10px]">
      <button 
        @click="previousPage"
        :disabled="currentPage === 1"
        class="bg-[#FEC564] text-[#2D1A47] border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed disabled:text-white hover:bg-[#FFD700] max-[480px]:py-[6px] max-[480px]:px-[15px] max-[480px]:text-[14px]"
      >
        Previous
      </button>
      <div class="flex gap-[10px]">
        <button 
          v-for="page in pageNumbers"
          :key="page"
          @click="currentPage = page"
          :class="[
            'w-[35px] h-[35px] flex justify-center items-center bg-transparent rounded-full cursor-pointer font-[\'Irish_Grover\'] transition-all duration-300 ease-in-out max-[480px]:w-[30px] max-[480px]:h-[30px] max-[480px]:text-[14px]',
            currentPage === page ? 'bg-[#FEC564] text-white' : 'text-white'
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button 
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-[#FEC564] text-[#2D1A47] border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed disabled:text-white hover:bg-[#FFD700] max-[480px]:py-[6px] max-[480px]:px-[15px] max-[480px]:text-[14px]"
      >
        Next
      </button>
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
      formatDate
    }
  }
}
</script>