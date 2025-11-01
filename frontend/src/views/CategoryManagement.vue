<template>
  <div class="py-8 min-h-[80vh] pt-[120px]">
    <div class="container mx-auto px-4">
      <div class="w-full">
        <h1 class="text-gold text-4xl mb-8 text-center">Category Management</h1>
      </div>

      <!-- Add Category Form -->
      <div class="w-full mb-8">
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-8 mb-8">
          <h3 class="text-gold mb-6 text-xl">Add New Category</h3>
          <form @submit.prevent="addCategory">
            <div class="mb-6">
              <label for="categoryName" class="text-gold font-bold mb-2 block">Category Name</label>
              <input 
                type="text" 
                id="categoryName" 
                v-model="newCategory.name" 
                class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                required
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
            
            <button 
              type="submit" 
              class="px-8 py-3 bg-gold text-black border-none rounded font-bold cursor-pointer transition-all duration-300 hover:bg-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="loading">Adding...</span>
              <span v-else>Add Category</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Categories List -->
      <div class="w-full">
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-8 mb-8">
          <h3 class="text-gold mb-6 text-xl">Existing Categories</h3>
          
          <div v-if="categoriesLoading" class="text-center py-8 text-gray-300">
            <h4 class="text-gold">Loading categories...</h4>
          </div>
          
          <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-300">
            <h4>No categories found</h4>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-white">
              <thead>
                <tr>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">ID</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Category Name</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category.categoryID">
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ category.categoryID }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">
                    <span v-if="!category.editing">{{ category.categoryName }}</span>
                    <input 
                      v-else
                      v-model="category.editName"
                      class="w-[200px] px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                      @keyup.enter="saveCategory(category)"
                      @keyup.escape="cancelEdit(category)"
                    />
                  </td>
                  <td class="border border-white/10 px-4 py-3 align-middle">
                    <div v-if="!category.editing" class="flex gap-2">
                      <button 
                        @click="startEdit(category)" 
                        class="px-3 py-1.5 bg-[#ffc107] text-black border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5"
                      >
                        Edit
                      </button>
                      <button 
                        @click="deleteCategory(category.categoryID)" 
                        class="px-3 py-1.5 bg-[#dc3545] text-white border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        :disabled="deleting"
                      >
                        Delete
                      </button>
                    </div>
                    <div v-else class="flex gap-2">
                      <button 
                        @click="saveCategory(category)" 
                        class="px-3 py-1.5 bg-[#28a745] text-white border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        :disabled="saving"
                      >
                        Save
                      </button>
                      <button 
                        @click="cancelEdit(category)" 
                        class="px-3 py-1.5 bg-[#6c757d] text-white border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5"
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
        } else {
          message.value = response.data.error || 'Failed to add category'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to add category'
        messageType.value = 'error'
      } finally {
        loading.value = false
        
        setTimeout(() => {
          message.value = ''
        }, 3000)
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

    const deleteCategory = async (categoryId) => {
      if (!confirm('Are you sure you want to delete this category?')) {
        return
      }

      deleting.value = true
      message.value = ''

      try {
        const response = await axios.delete(`/api/categories/${categoryId}`)

        if (response.data.success) {
          message.value = 'Category deleted successfully!'
          messageType.value = 'success'
          await fetchCategories()
        } else {
          message.value = response.data.error || 'Failed to delete category'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to delete category'
        messageType.value = 'error'
      } finally {
        deleting.value = false
        
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
      addCategory,
      startEdit,
      cancelEdit,
      saveCategory,
      deleteCategory
    }
  }
}
</script>