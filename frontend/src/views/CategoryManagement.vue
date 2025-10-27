<template>
  <div class="admin-page">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">Category Management</h1>
        </div>
      </div>

      <!-- Add Category Form -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="admin-form">
            <h3>Add New Category</h3>
            <form @submit.prevent="addCategory">
              <div class="form-group">
                <label for="categoryName">Category Name</label>
                <input 
                  type="text" 
                  id="categoryName" 
                  v-model="newCategory.name" 
                  class="form-control"
                  required
                />
              </div>
              
              <div v-if="message" class="message" :class="messageType">
                {{ message }}
              </div>
              
              <button 
                type="submit" 
                class="submit-btn"
                :disabled="loading"
              >
                <span v-if="loading">Adding...</span>
                <span v-else>Add Category</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Categories List -->
      <div class="row">
        <div class="col-12">
          <div class="admin-table">
            <h3>Existing Categories</h3>
            
            <div v-if="categoriesLoading" class="loading">
              <h4 style="color: #FEC564;">Loading categories...</h4>
            </div>
            
            <div v-else-if="categories.length === 0" class="no-data">
              <h4>No categories found</h4>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="category in categories" :key="category.categoryID">
                    <td>{{ category.categoryID }}</td>
                    <td>
                      <span v-if="!category.editing">{{ category.categoryName }}</span>
                      <input 
                        v-else
                        v-model="category.editName"
                        class="form-control edit-input"
                        @keyup.enter="saveCategory(category)"
                        @keyup.escape="cancelEdit(category)"
                      />
                    </td>
                    <td>
                      <div v-if="!category.editing" class="action-buttons">
                        <button 
                          @click="startEdit(category)" 
                          class="btn btn-warning btn-sm me-2"
                        >
                          Edit
                        </button>
                        <button 
                          @click="deleteCategory(category.categoryID)" 
                          class="btn btn-danger btn-sm"
                          :disabled="deleting"
                        >
                          Delete
                        </button>
                      </div>
                      <div v-else class="action-buttons">
                        <button 
                          @click="saveCategory(category)" 
                          class="btn btn-success btn-sm me-2"
                          :disabled="saving"
                        >
                          Save
                        </button>
                        <button 
                          @click="cancelEdit(category)" 
                          class="btn btn-secondary btn-sm"
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

.admin-form,
.admin-table {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.admin-form h3,
.admin-table h3 {
  color: #FEC564;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  color: #FEC564;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #FEC564;
  box-shadow: 0 0 0 2px rgba(254, 197, 100, 0.2);
}

.edit-input {
  width: 200px;
}

.submit-btn {
  padding: 0.75rem 2rem;
  background: #FEC564;
  color: #000;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #ffd700;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.message.success {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.message.error {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  border: 1px solid rgba(255, 0, 0, 0.3);
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

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.btn-warning {
  background: #ffc107;
  color: #000;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn:hover:not(:disabled) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

