<template>
  <div class="admin-page">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">Product Management</h1>
        </div>
      </div>

      <!-- Add Product Form -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="admin-form">
            <h3>Add New Book</h3>
            <form @submit.prevent="addBook">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="bookName">Book Name</label>
                    <input 
                      type="text" 
                      id="bookName" 
                      v-model="newBook.name" 
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="categoryID">Category</label>
                    <select 
                      id="categoryID" 
                      v-model="newBook.categoryID" 
                      class="form-control"
                      required
                    >
                      <option value="">Select Category</option>
                      <option 
                        v-for="category in categories" 
                        :key="category.categoryID"
                        :value="category.categoryID"
                      >
                        {{ category.categoryName }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="bookDescription">Description</label>
                <textarea 
                  id="bookDescription" 
                  v-model="newBook.description" 
                  class="form-control"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="price">Price</label>
                    <input 
                      type="number" 
                      id="price" 
                      v-model="newBook.price" 
                      class="form-control"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="proPrice">Promotion Price</label>
                    <input 
                      type="number" 
                      id="proPrice" 
                      v-model="newBook.proPrice" 
                      class="form-control"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="isPromotionBook">Is Promotion Book</label>
                    <select 
                      id="isPromotionBook" 
                      v-model="newBook.isPromotionBook" 
                      class="form-control"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
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
                <span v-else>Add Book</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Books List -->
      <div class="row">
        <div class="col-12">
          <div class="admin-table">
            <h3>Existing Books</h3>
            
            <div v-if="booksLoading" class="loading">
              <h4 style="color: #FEC564;">Loading books...</h4>
            </div>
            
            <div v-else-if="books.length === 0" class="no-data">
              <h4>No books found</h4>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Promo Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in books" :key="book.bookID">
                    <td>{{ book.bookID }}</td>
                    <td>{{ book.bookName }}</td>
                    <td>{{ book.categoryName }}</td>
                    <td>{{ book.price }} G</td>
                    <td>{{ book.proPrice || '-' }} G</td>
                    <td>
                      <div class="action-buttons">
                        <button 
                          @click="editBook(book)" 
                          class="btn btn-warning btn-sm me-2"
                        >
                          Edit
                        </button>
                        <button 
                          @click="deleteBook(book.bookID)" 
                          class="btn btn-danger btn-sm"
                          :disabled="deleting"
                        >
                          Delete
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

      <!-- Edit Book Modal -->
      <div v-if="editingBook" class="modal-overlay" @click="closeEditModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Edit Book</h3>
            <button @click="closeEditModal" class="close-btn">&times;</button>
          </div>
          
          <form @submit.prevent="updateBook">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="editBookName">Book Name</label>
                    <input 
                      type="text" 
                      id="editBookName" 
                      v-model="editingBook.bookName" 
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="editCategoryID">Category</label>
                    <select 
                      id="editCategoryID" 
                      v-model="editingBook.categoryID" 
                      class="form-control"
                      required
                    >
                      <option 
                        v-for="category in categories" 
                        :key="category.categoryID"
                        :value="category.categoryID"
                      >
                        {{ category.categoryName }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="editBookDescription">Description</label>
                <textarea 
                  id="editBookDescription" 
                  v-model="editingBook.bookDescription" 
                  class="form-control"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="editPrice">Price</label>
                    <input 
                      type="number" 
                      id="editPrice" 
                      v-model="editingBook.price" 
                      class="form-control"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="editProPrice">Promotion Price</label>
                    <input 
                      type="number" 
                      id="editProPrice" 
                      v-model="editingBook.proPrice" 
                      class="form-control"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="editIsPromotionBook">Is Promotion Book</label>
                    <select 
                      id="editIsPromotionBook" 
                      v-model="editingBook.isPromotionBook" 
                      class="form-control"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button 
                type="button" 
                @click="closeEditModal" 
                class="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-success"
                :disabled="saving"
              >
                <span v-if="saving">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'ProductManagement',
  setup() {
    const books = ref([])
    const categories = ref([])
    const booksLoading = ref(false)
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const message = ref('')
    const messageType = ref('')
    const editingBook = ref(null)
    
    const newBook = ref({
      name: '',
      categoryID: '',
      description: '',
      price: '',
      proPrice: '',
      isPromotionBook: 'false'
    })

    const fetchBooks = async () => {
      booksLoading.value = true
      try {
        const response = await axios.get('/api/allBooks')
        books.value = response.data
      } catch (error) {
        console.error('Error fetching books:', error)
        message.value = 'Failed to load books'
        messageType.value = 'error'
      } finally {
        booksLoading.value = false
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories')
        categories.value = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const addBook = async () => {
      if (!newBook.value.name || !newBook.value.categoryID || !newBook.value.price) {
        message.value = 'Please fill in all required fields'
        messageType.value = 'error'
        return
      }

      loading.value = true
      message.value = ''

      try {
        // Get category name
        const selectedCategory = categories.value.find(cat => cat.categoryID === Number.parseInt(newBook.value.categoryID))
        const categoryName = selectedCategory ? selectedCategory.categoryName : ''

        const response = await axios.post('/api/books', {
          bookName: newBook.value.name,
          categoryID: Number.parseInt(newBook.value.categoryID),
          categoryName: categoryName,
          bookDescription: newBook.value.description,
          price: Number.parseFloat(newBook.value.price),
          proPrice: newBook.value.proPrice ? Number.parseFloat(newBook.value.proPrice) : null,
          isPromotionBook: newBook.value.isPromotionBook
        })

        if (response.data.success) {
          message.value = 'Book added successfully!'
          messageType.value = 'success'
          newBook.value = {
            name: '',
            categoryID: '',
            description: '',
            price: '',
            proPrice: '',
            isPromotionBook: 'false'
          }
          await fetchBooks()
        } else {
          message.value = response.data.error || 'Failed to add book'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to add book'
        messageType.value = 'error'
      } finally {
        loading.value = false
        
        setTimeout(() => {
          message.value = ''
        }, 3000)
      }
    }

    const editBook = (book) => {
      editingBook.value = {
        ...book,
        isPromotionBook: book.proPrice ? 'true' : 'false'
      }
    }

    const closeEditModal = () => {
      editingBook.value = null
    }

    const updateBook = async () => {
      if (!editingBook.value) return

      saving.value = true
      message.value = ''

      try {
        // Get category name
        const selectedCategory = categories.value.find(cat => cat.categoryID === editingBook.value.categoryID)
        const categoryName = selectedCategory ? selectedCategory.categoryName : editingBook.value.categoryName

        const response = await axios.put(`/api/books/${editingBook.value.bookID}`, {
          bookName: editingBook.value.bookName,
          categoryID: editingBook.value.categoryID,
          categoryName: categoryName,
          bookDescription: editingBook.value.bookDescription,
          price: Number.parseFloat(editingBook.value.price),
          proPrice: editingBook.value.proPrice ? Number.parseFloat(editingBook.value.proPrice) : null,
          isPromotionBook: editingBook.value.isPromotionBook
        })

        if (response.data.success) {
          message.value = 'Book updated successfully!'
          messageType.value = 'success'
          closeEditModal()
          await fetchBooks()
        } else {
          message.value = response.data.error || 'Failed to update book'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to update book'
        messageType.value = 'error'
      } finally {
        saving.value = false
        
        setTimeout(() => {
          message.value = ''
        }, 3000)
      }
    }

    const deleteBook = async (bookId) => {
      if (!confirm('Are you sure you want to delete this book?')) {
        return
      }

      deleting.value = true
      message.value = ''

      try {
        const response = await axios.delete(`/api/books/${bookId}`)

        if (response.data.success) {
          message.value = 'Book deleted successfully!'
          messageType.value = 'success'
          await fetchBooks()
        } else {
          message.value = response.data.error || 'Failed to delete book'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = error.response?.data?.error || 'Failed to delete book'
        messageType.value = 'error'
      } finally {
        deleting.value = false
        
        setTimeout(() => {
          message.value = ''
        }, 3000)
      }
    }

    onMounted(async () => {
      await Promise.all([
        fetchBooks(),
        fetchCategories()
      ])
    })

    return {
      books,
      categories,
      booksLoading,
      loading,
      saving,
      deleting,
      message,
      messageType,
      editingBook,
      newBook,
      addBook,
      editBook,
      closeEditModal,
      updateBook,
      deleteBook
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: #FEC564;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

