<template>
  <div class="py-8 min-h-[80vh] pt-[120px]">
    <div class="container mx-auto px-4">
      <div class="w-full">
        <h1 class="text-gold text-4xl mb-8 text-center">Sales History</h1>
      </div>

      <!-- History Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-6 flex items-center mb-4 max-md:flex-col max-md:text-center">
          <div class="bg-gold/20 rounded-full w-[60px] h-[60px] flex items-center justify-center mr-4 max-md:mr-0 max-md:mb-4">
            <i class="fas fa-book text-gold text-2xl"></i>
          </div>
          <div>
            <h3 class="text-gold text-2xl m-0 font-bold">{{ totalBooks }}</h3>
            <p class="text-gray-300 m-0 text-sm">Total Books Sold</p>
          </div>
        </div>
        
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-6 flex items-center mb-4 max-md:flex-col max-md:text-center">
          <div class="bg-gold/20 rounded-full w-[60px] h-[60px] flex items-center justify-center mr-4 max-md:mr-0 max-md:mb-4">
            <i class="fas fa-shopping-cart text-gold text-2xl"></i>
          </div>
          <div>
            <h3 class="text-gold text-2xl m-0 font-bold">{{ totalOrders }}</h3>
            <p class="text-gray-300 m-0 text-sm">Total Orders</p>
          </div>
        </div>
        
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-6 flex items-center mb-4 max-md:flex-col max-md:text-center">
          <div class="bg-gold/20 rounded-full w-[60px] h-[60px] flex items-center justify-center mr-4 max-md:mr-0 max-md:mb-4">
            <i class="fas fa-coins text-gold text-2xl"></i>
          </div>
          <div>
            <h3 class="text-gold text-2xl m-0 font-bold">{{ totalRevenue }} G</h3>
            <p class="text-gray-300 m-0 text-sm">Total Revenue</p>
          </div>
        </div>
        
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-6 flex items-center mb-4 max-md:flex-col max-md:text-center">
          <div class="bg-gold/20 rounded-full w-[60px] h-[60px] flex items-center justify-center mr-4 max-md:mr-0 max-md:mb-4">
            <i class="fas fa-chart-line text-gold text-2xl"></i>
          </div>
          <div>
            <h3 class="text-gold text-2xl m-0 font-bold">{{ averageOrderValue }} G</h3>
            <p class="text-gray-300 m-0 text-sm">Average Order Value</p>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="w-full">
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-8 mb-8">
          <h3 class="text-gold mb-6 text-xl">Sales History</h3>
          
          <div v-if="loading" class="text-center py-8 text-gray-300">
            <h4 class="text-gold">Loading history...</h4>
          </div>
          
          <div v-else-if="history.length === 0" class="text-center py-8 text-gray-300">
            <h4>No sales history found</h4>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-white">
              <thead>
                <tr>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">ID</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Book Name</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Category</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Quantity</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Price</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Enchantment</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Total</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in history" :key="item.historyID">
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ item.historyID }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ item.bookName }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ item.categoryName }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ item.quantity }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ item.sellPrice }} G</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ item.enchantment || '-' }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ (item.sellPrice * item.quantity).toFixed(2) }} G</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ formatDate(item.createdAt || new Date()) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
    const loading = ref(false)

    const totalBooks = computed(() => {
      return history.value.reduce((total, item) => total + item.quantity, 0)
    })

    const totalOrders = computed(() => {
      return history.value.length
    })

    const totalRevenue = computed(() => {
      return history.value.reduce((total, item) => total + (item.sellPrice * item.quantity), 0).toFixed(2)
    })

    const averageOrderValue = computed(() => {
      if (totalOrders.value === 0) return 0
      return (totalRevenue.value / totalOrders.value).toFixed(2)
    })

    const fetchHistory = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/history')
        history.value = response.data
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        loading.value = false
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
      loading,
      totalBooks,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      formatDate
    }
  }
}
</script>