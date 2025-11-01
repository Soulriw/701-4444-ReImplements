<template>
  <div class="py-8 min-h-[80vh] pt-[120px]">
    <div class="container mx-auto px-4">
      <div class="w-full">
        <h1 class="text-gold text-4xl mb-8 text-center">Product Management</h1>
      </div>

      <!-- Add Product Form -->
      <div class="w-full mb-8">
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-8 mb-8">
          <h3 class="text-gold mb-6 text-xl">Add New Book</h3>
          <form @submit.prevent="addBook">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="bookName" class="text-gold font-bold mb-2 block">Book Name</label>
                <input 
                  type="text" 
                  id="bookName" 
                  v-model="newBook.name" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  required
                />
              </div>
              
              <div>
                <label for="categoryID" class="text-gold font-bold mb-2 block">Category</label>
                <select 
                  id="categoryID" 
                  v-model="newBook.categoryID" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
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
            
            <div class="mb-6">
              <label for="bookDescription" class="text-gold font-bold mb-2 block">Description</label>
              <textarea 
                id="bookDescription" 
                v-model="newBook.description" 
                class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label for="price" class="text-gold font-bold mb-2 block">Price</label>
                <input 
                  type="number" 
                  id="price" 
                  v-model="newBook.price" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label for="proPrice" class="text-gold font-bold mb-2 block">Promotion Price</label>
                <input 
                  type="number" 
                  id="proPrice" 
                  v-model="newBook.proPrice" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <label for="isPromotionBook" class="text-gold font-bold mb-2 block">Is Promotion Book</label>
                <select 
                  id="isPromotionBook" 
                  v-model="newBook.isPromotionBook" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
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
              <span v-else>Add Book</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Books List -->
      <div class="w-full">
        <div class="bg-white/5 border border-white/10 rounded-[10px] p-8 mb-8">
          <h3 class="text-gold mb-6 text-xl">Existing Books</h3>
          
          <div v-if="booksLoading" class="text-center py-8 text-gray-300">
            <h4 class="text-gold">Loading books...</h4>
          </div>
          
          <div v-else-if="books.length === 0" class="text-center py-8 text-gray-300">
            <h4>No books found</h4>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-white">
              <thead>
                <tr>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">ID</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Name</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Category</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Price</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Promo Price</th>
                  <th class="bg-gold/20 text-gold border border-white/10 px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in books" :key="book.bookID">
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ book.bookID }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ book.bookName }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ book.categoryName }}</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ book.price }} G</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">{{ book.proPrice || '-' }} G</td>
                  <td class="border border-white/10 px-4 py-3 align-middle">
                    <div class="flex gap-2">
                      <button 
                        @click="editBook(book)" 
                        class="px-3 py-1.5 bg-[#ffc107] text-black border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5"
                      >
                        Edit
                      </button>
                      <button 
                        @click="deleteBook(book.bookID)" 
                        class="px-3 py-1.5 bg-[#dc3545] text-white border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
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

      <!-- Edit Book Modal -->
      <div v-if="editingBook" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]" @click="closeEditModal">
        <div class="bg-white/10 border border-white/20 rounded-[10px] w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center p-6 border-b border-white/10">
            <h3 class="text-gold m-0 text-xl">Edit Book</h3>
            <button @click="closeEditModal" class="bg-transparent border-none text-white text-3xl cursor-pointer">&times;</button>
          </div>
          
          <form @submit.prevent="updateBook">
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="editBookName" class="text-gold font-bold mb-2 block">Book Name</label>
                  <input 
                    type="text" 
                    id="editBookName" 
                    v-model="editingBook.bookName" 
                    class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                    required
                  />
                </div>
                
                <div>
                  <label for="editCategoryID" class="text-gold font-bold mb-2 block">Category</label>
                  <select 
                    id="editCategoryID" 
                    v-model="editingBook.categoryID" 
                    class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
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
              
              <div class="mb-6">
                <label for="editBookDescription" class="text-gold font-bold mb-2 block">Description</label>
                <textarea 
                  id="editBookDescription" 
                  v-model="editingBook.bookDescription" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label for="editPrice" class="text-gold font-bold mb-2 block">Price</label>
                  <input 
                    type="number" 
                    id="editPrice" 
                    v-model="editingBook.price" 
                    class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label for="editProPrice" class="text-gold font-bold mb-2 block">Promotion Price</label>
                  <input 
                    type="number" 
                    id="editProPrice" 
                    v-model="editingBook.proPrice" 
                    class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label for="editIsPromotionBook" class="text-gold font-bold mb-2 block">Is Promotion Book</label>
                  <select 
                    id="editIsPromotionBook" 
                    v-model="editingBook.isPromotionBook" 
                    class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-4 p-6 border-t border-white/10">
              <button 
                type="button" 
                @click="closeEditModal" 
                class="px-3 py-1.5 bg-[#6c757d] text-white border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-3 py-1.5 bg-[#28a745] text-white border-none rounded text-sm cursor-pointer transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
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