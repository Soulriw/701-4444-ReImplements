<template>
  <div class="admin-page">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">Sales History</h1>
        </div>
      </div>

      <!-- History Stats -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-content">
              <h3>{{ totalBooks }}</h3>
              <p>Total Books Sold</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-content">
              <h3>{{ totalOrders }}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-coins"></i>
            </div>
            <div class="stat-content">
              <h3>{{ totalRevenue }} G</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
              <h3>{{ averageOrderValue }} G</h3>
              <p>Average Order Value</p>
            </div>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="row">
        <div class="col-12">
          <div class="admin-table">
            <h3>Sales History</h3>
            
            <div v-if="loading" class="loading">
              <h4 style="color: #FEC564;">Loading history...</h4>
            </div>
            
            <div v-else-if="history.length === 0" class="no-data">
              <h4>No sales history found</h4>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Book Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Enchantment</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in history" :key="item.historyID">
                    <td>{{ item.historyID }}</td>
                    <td>{{ item.bookName }}</td>
                    <td>{{ item.categoryName }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.sellPrice }} G</td>
                    <td>{{ item.enchantment || '-' }}</td>
                    <td>{{ (item.sellPrice * item.quantity).toFixed(2) }} G</td>
                    <td>{{ formatDate(item.createdAt || new Date()) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

<style scoped>
.admin-page {
  padding: 2rem 0;
  min-height: 80vh;
}

.page-title {
  color: #FEC564;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-icon {
  background: rgba(254, 197, 100, 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.stat-icon i {
  color: #FEC564;
  font-size: 1.5rem;
}

.stat-content h3 {
  color: #FEC564;
  font-size: 1.5rem;
  margin: 0;
  font-weight: bold;
}

.stat-content p {
  color: #ccc;
  margin: 0;
  font-size: 0.9rem;
}

.admin-table {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.admin-table h3 {
  color: #FEC564;
  margin-bottom: 1.5rem;
}

.loading,
.no-data {
  text-align: center;
  padding: 2rem;
  color: #ccc;
}

.table {
  color: white;
}

.table th {
  background: rgba(254, 197, 100, 0.2);
  color: #FEC564;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table td {
  border: 1px solid rgba(255, 255, 255, 0.1);
  vertical-align: middle;
}

@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>

