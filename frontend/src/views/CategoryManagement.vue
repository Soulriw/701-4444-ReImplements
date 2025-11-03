<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 20%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500]">
    <div class="max-w-[900px] my-[15px] mx-auto px-[15px] lg:max-w-[90%] lg:my-[12px] md:max-w-[95%] md:my-[10px] md:px-[8px] max-[480px]:max-w-[95%] max-[375px]:max-w-[95%]">
      <h1 class="text-[#FEC564] text-center mb-8 lg:text-[24px] md:text-[24px] max-[480px]:text-[22px] max-[480px]:p-[8px] max-[375px]:text-[20px] max-[375px]:p-[6px]">Category Management</h1>

      <!-- Categories Table -->
      <div v-if="categoriesLoading" class="text-center py-8 text-gray-300">
        <h4 class="text-[#FEC564]">Loading categories...</h4>
      </div>
      
      <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-300">
        <h4>No categories found</h4>
      </div>
      
      <div v-else class="relative w-full mt-[10px] rounded-[20px] overflow-hidden">
        <div class="table-scroll-container max-h-[350px] overflow-y-auto overflow-x-hidden relative lg:max-h-[320px] md:max-h-[300px]" style="scrollbar-width: thin; scrollbar-color: #888 #f1f1f1;">
          <table class="w-full border-collapse bg-white relative table-fixed shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <thead class="sticky top-0 z-[10] bg-[#FEC564]">
              <tr>
                <th class="bg-[#FEC564] text-[#2D1A47] py-[12px] px-[15px] font-['Irish Grover'] text-[18px] text-center lg:py-[10px] lg:px-[12px] md:py-[8px] md:px-[10px] max-[480px]:py-[8px] max-[480px]:px-[6px] max-[375px]:py-[6px] max-[375px]:px-[4px] rounded-tl-[20px]">ID</th>
                <th class="bg-[#FEC564] text-[#2D1A47] py-[12px] px-[15px] font-['Irish Grover'] text-[18px] text-center w-[60%] lg:py-[10px] lg:px-[12px] md:py-[8px] md:px-[10px] md:w-[55%] max-[480px]:py-[8px] max-[480px]:px-[6px] max-[480px]:w-[50%] max-[375px]:py-[6px] max-[375px]:px-[4px] max-[375px]:w-[50%]">Category Name</th>
                <th class="bg-[#FEC564] text-[#2D1A47] py-[12px] px-[15px] font-['Irish Grover'] text-[18px] text-center w-[40%] pr-[25px] lg:py-[10px] lg:px-[12px] lg:pr-[25px] md:py-[8px] md:px-[10px] md:w-[45%] md:pr-[25px] max-[480px]:py-[8px] max-[480px]:px-[6px] max-[480px]:w-[50%] max-[480px]:pr-[20px] max-[375px]:py-[6px] max-[375px]:px-[4px] max-[375px]:w-[50%] max-[375px]:pr-[18px] rounded-tr-[20px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(category, index) in categories" 
                :key="category.categoryID"
                :class="{
                  'bg-[#f9f9f9]': index % 2 === 0,
                  'bg-white': index % 2 === 1,
                  'hover:bg-[#f0f0f0]': true
                }"
              >
                <td class="py-[12px] px-[15px] border-b border-[#eee] font-['Irish Grover'] text-[16px] text-center pl-0 lg:py-[10px] lg:px-[12px] md:py-[8px] md:px-[10px] md:text-[14px] max-[480px]:py-[8px] max-[480px]:px-[6px] max-[480px]:text-[13px] max-[375px]:py-[6px] max-[375px]:px-[4px] max-[375px]:text-[12px]" :class="{ 'rounded-bl-[20px] border-b-0': index === categories.length - 1 }">
                  {{ category.categoryID }}
                </td>
                <td class="py-[12px] px-[15px] border-b border-[#eee] font-['Irish Grover'] text-[16px] text-center lg:py-[10px] lg:px-[12px] md:py-[8px] md:px-[10px] md:text-[14px] max-[480px]:py-[8px] max-[480px]:px-[6px] max-[480px]:text-[13px] max-[375px]:py-[6px] max-[375px]:px-[4px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === categories.length - 1 }">
                  <span v-if="!category.editing">{{ category.categoryName }}</span>
                  <input 
                    v-else
                    v-model="category.editName"
                    class="w-full px-[10px] py-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[10px] focus:outline-none"
                    @keyup.enter="saveCategory(category)"
                    @keyup.escape="cancelEdit(category)"
                  />
                </td>
                <td class="py-[12px] px-[15px] border-b border-[#eee] font-['Irish Grover'] text-[16px] text-center pr-[25px] lg:py-[10px] lg:px-[12px] lg:pr-[25px] md:py-[8px] md:px-[10px] md:pr-[25px] max-[480px]:py-[8px] max-[480px]:px-[6px] max-[480px]:pr-[20px] max-[375px]:py-[6px] max-[375px]:px-[4px] max-[375px]:pr-[18px]" :class="{ 'rounded-br-[20px] border-b-0': index === categories.length - 1 }">
                  <div v-if="!category.editing" class="flex justify-center items-center gap-[12px] max-[480px]:gap-[10px] max-[375px]:gap-[8px]">
                    <i 
                      @click="startEdit(category)" 
                      class="fas fa-edit cursor-pointer text-[18px] min-w-[20px] transition-transform hover:scale-125 text-[#2D1A47] md:text-[16px] max-[480px]:text-[16px] max-[375px]:text-[15px]"
                    ></i>
                    <i 
                      @click="showDeleteModalFunc(category.categoryID)" 
                      class="fas fa-trash cursor-pointer text-[18px] min-w-[20px] transition-transform hover:scale-125 text-[#ff4444] md:text-[16px] max-[480px]:text-[16px] max-[375px]:text-[15px]"
                    ></i>
                  </div>
                  <div v-else class="flex justify-center items-center gap-[12px]">
                    <button 
                      @click="saveCategory(category)" 
                      :class="{ 'loading': saving }"
                      class="bg-[#FEC564] text-[#2D1A47] border-none py-[8px] px-[16px] rounded-[10px] cursor-pointer font-['Irish Grover'] transition-colors disabled:opacity-60 disabled:cursor-not-allowed max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[13px]"
                      :disabled="saving"
                    >
                      <span v-if="!saving">Save</span>
                    </button>
                    <button 
                      @click="cancelEdit(category)" 
                      class="bg-[#777] text-white border-none py-[8px] px-[16px] rounded-[10px] cursor-pointer font-['Irish Grover'] max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[13px]"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Category Floating Button -->
      <div class="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-[100]">
        <button 
          @click="showCategoryModal = true"
          class="bg-[#FEC564] text-[#2D1A47] border-none py-[10px] px-[20px] rounded-[25px] cursor-pointer font-['Irish Grover'] text-[16px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-[3px] hover:shadow-[0_6px_15px_rgba(0,0,0,0.4)] md:py-[8px] md:px-[16px] md:text-[15px] max-[480px]:py-[7px] max-[480px]:px-[14px] max-[480px]:text-[14px] max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[13px]"
        >
          Add Category
        </button>
      </div>

      <!-- Category Modal -->
      <div 
        v-if="showCategoryModal" 
        class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[1000] flex justify-center items-center"
        @click.self="showCategoryModal = false"
      >
        <div class="bg-[#2D1A47] text-[#FEC564] p-[25px] rounded-[20px] max-w-[450px] w-[90%] max-h-[90vh] overflow-y-auto font-['Irish Grover'] relative max-[480px]:p-[20px] max-[480px]:max-w-[320px]">
          <div class="absolute top-[10px] right-[10px] text-[24px] cursor-pointer text-[#FEC564]" @click="showCategoryModal = false">
            &times;
          </div>
          
          <h2 class="mb-6 text-xl">Add New Category</h2>
          
          <div class="mb-[15px]">
            <label class="block mb-[5px] text-[#FEC564]">Category Name</label>
              <input 
                type="text" 
                v-model="newCategory.name" 
              class="w-full py-[10px] px-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[10px] focus:outline-none"
              placeholder="Enter category name"
              />
            </div>
            
            <div 
              v-if="message" 
              class="p-4 rounded mb-4 text-center font-bold"
              :class="{
                'bg-green/20 text-green border border-green/30': messageType === 'success',
                'bg-red/20 text-[#ff4444] border border-red/30': messageType === 'error'
              }"
            >
              {{ message }}
            </div>
            
          <div class="flex justify-end gap-[12px] mt-[15px]">
            <button 
              @click="showCategoryModal = false"
              class="bg-[#777] text-white border-none py-[8px] px-[16px] rounded-[10px] cursor-pointer font-['Irish Grover'] max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[13px]"
            >
              Cancel
            </button>
            <button 
              @click="addCategory"
              :class="{ 'loading': loading }"
              class="bg-[#FEC564] text-[#2D1A47] border-none py-[8px] px-[16px] rounded-[10px] cursor-pointer font-['Irish Grover'] transition-colors disabled:opacity-60 disabled:cursor-not-allowed max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[13px]"
              :disabled="loading"
            >
              <span v-if="!loading">Save</span>
            </button>
          </div>

          <div 
            v-if="loading" 
            class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-[10] cursor-not-allowed rounded-[20px]"
          ></div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div 
        v-if="showDeleteModal" 
        class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[1000] flex justify-center items-center"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-[#2D1A47] text-[#FEC564] p-[25px] rounded-[20px] max-w-[450px] w-[90%] max-h-[90vh] overflow-y-auto font-['Irish Grover'] relative max-[480px]:p-[20px] max-[480px]:max-w-[320px]">
          <div class="absolute top-[10px] right-[10px] text-[24px] cursor-pointer text-[#FEC564]" @click="showDeleteModal = false">
            &times;
          </div>
          
          <h2 class="mb-6 text-xl">Confirm Delete</h2>
          <p class="mb-6">Are you sure you want to delete this category?</p>

          <div class="flex justify-end gap-[12px] mt-[15px]">
                      <button 
              @click="showDeleteModal = false"
              class="bg-[#777] text-white border-none py-[8px] px-[16px] rounded-[10px] cursor-pointer font-['Irish Grover'] max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[13px]"
                      >
              Cancel
                      </button>
                      <button 
              @click="confirmDelete"
              :class="{ 'loading': deleting }"
              class="bg-[#FEC564] text-[#2D1A47] border-none py-[8px] px-[16px] rounded-[10px] cursor-pointer font-['Irish Grover'] transition-colors disabled:opacity-60 disabled:cursor-not-allowed max-[375px]:py-[6px] max-[375px]:px-[12px] max-[375px]:text-[13px]"
                        :disabled="deleting"
                      >
              <span v-if="!deleting">Confirm</span>
                      </button>
          </div>

          <div 
            v-if="deleting" 
            class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-[10] cursor-not-allowed rounded-[20px]"
          ></div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'CategoryManagement',
  setup() {
    const categories = ref([])
    const categoriesLoading = ref(false)
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const message = ref('')
    const messageType = ref('')
    const showCategoryModal = ref(false)
    const showDeleteModal = ref(false)
    const categoryToDelete = ref(null)
    
    const newCategory = ref({
      name: ''
    })

    const fetchCategories = async () => {
      categoriesLoading.value = true
      try {
        const response = await axios.get('/api/categories')
        categories.value = response.data
          .map(cat => ({
            ...cat,
            editing: false,
            editName: cat.categoryName
          }))
          .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
      } catch (error) {
        console.error('Error fetching categories:', error)
        message.value = 'Failed to load categories'
        messageType.value = 'error'
      } finally {
        categoriesLoading.value = false
      }
    }

    const addCategory = async () => {
      if (!newCategory.value.name.trim()) {
        message.value = 'Category name is required'
        messageType.value = 'error'
        return
      }

      loading.value = true
      message.value = ''

      try {
        const response = await axios.post('/api/categories', {
          categoryName: newCategory.value.name.trim()
        })

        if (response.data.success) {
          message.value = 'Category added successfully!'
          messageType.value = 'success'
          newCategory.value.name = ''
          await fetchCategories()
          setTimeout(() => {
            showCategoryModal.value = false
            message.value = ''
          }, 1000)
        } else {
          message.value = response.data.error || 'Failed to add category'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to add category'
        messageType.value = 'error'
      } finally {
        loading.value = false
        
        if (messageType.value === 'error') {
          setTimeout(() => {
            message.value = ''
          }, 3000)
        }
      }
    }

    const showDeleteModalFunc = (categoryId) => {
      categoryToDelete.value = categoryId
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!categoryToDelete.value) return

      deleting.value = true
      message.value = ''

      try {
        const response = await axios.delete(`/api/categories/${categoryToDelete.value}`)

        if (response.data.success) {
          message.value = 'Category deleted successfully!'
          messageType.value = 'success'
          await fetchCategories()
          setTimeout(() => {
            showDeleteModal.value = false
            categoryToDelete.value = null
            message.value = ''
          }, 1000)
        } else {
          message.value = response.data.error || 'Failed to delete category'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to delete category'
        messageType.value = 'error'
      } finally {
        deleting.value = false
        
        if (messageType.value === 'error') {
        setTimeout(() => {
          message.value = ''
        }, 3000)
        }
      }
    }

    const startEdit = (category) => {
      category.editing = true
      category.editName = category.categoryName
    }

    const cancelEdit = (category) => {
      category.editing = false
      category.editName = category.categoryName
    }

    const saveCategory = async (category) => {
      if (!category.editName.trim()) {
        message.value = 'Category name cannot be empty'
        messageType.value = 'error'
        return
      }

      saving.value = true
      message.value = ''

      try {
        const response = await axios.put(`/api/categories/${category.categoryID}`, {
          categoryName: category.editName.trim()
        })

        if (response.data.success) {
          message.value = 'Category updated successfully!'
          messageType.value = 'success'
          category.categoryName = category.editName.trim()
          category.editing = false
        } else {
          message.value = response.data.error || 'Failed to update category'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to update category'
        messageType.value = 'error'
      } finally {
        saving.value = false
        
        setTimeout(() => {
          message.value = ''
        }, 3000)
      }
    }


    onMounted(() => {
      fetchCategories()
    })

    return {
      categories,
      categoriesLoading,
      loading,
      saving,
      deleting,
      message,
      messageType,
      newCategory,
      showCategoryModal,
      showDeleteModal,
      addCategory,
      startEdit,
      cancelEdit,
      saveCategory,
      showDeleteModalFunc,
      confirmDelete
    }
  }
}
</script>

<style scoped>
/* Loading Spinner */
.loading {
  position: relative;
  color: transparent !important;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: button-loading-spinner 1s linear infinite;
}

@keyframes button-loading-spinner {
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(1turn);
  }
}

/* Scrollbar Styling */
.table-scroll-container::-webkit-scrollbar {
  width: 8px;
  position: absolute;
  right: 0;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #FEC564;
}

@media screen and (max-width: 375px) {
  .table-scroll-container::-webkit-scrollbar {
    width: 6px;
  }
}
</style>