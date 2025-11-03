<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 0%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Stars background animation layer -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #FEC564, transparent), radial-gradient(2px 2px at 40px 70px, #FEC564, transparent), radial-gradient(1px 1px at 90px 40px, #FEC564, transparent), radial-gradient(1px 1px at 130px 80px, #FEC564, transparent), radial-gradient(2px 2px at 160px 30px, #FEC564, transparent); background-size: 200px 100px;"></div>
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500]">
    <!-- Category Container -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px]">
      <div class="flex overflow-x-auto gap-[15px] pb-[10px] justify-center scroll-snap-x">
        <div 
          v-for="category in categories" 
          :key="category.categoryID"
          @click="selectCategory(category.categoryID)"
          :class="[
            'flex-[0_0_auto] bg-white text-black py-[15px] px-[30px] rounded-[10px] cursor-pointer transition-all duration-300 ease-in-out font-[\'Irish_Grover\'] text-[18px] text-center min-w-[150px] scroll-snap-start max-md:py-[10px] max-md:px-5 max-md:min-w-[120px] max-md:text-base max-[480px]:min-w-[100px] max-[480px]:text-[14px]',
            selectedCategory === category.categoryID ? 'bg-[#FEC564] text-black' : 'hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]'
          ]"
        >
          {{ category.categoryName }}
        </div>
      </div>
    </div>

    <!-- Category Pagination -->
    <div v-if="totalCategoryPages > 1" class="flex justify-center items-center my-5 mx-auto gap-[10px]">
      <button 
        @click="categoryPage--"
        :disabled="categoryPage === 1"
        class="bg-[#FEC564] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div class="flex gap-[10px]">
        <button 
          v-for="page in categoryPageNumbers" 
          :key="page"
          @click="categoryPage = page"
          :class="[
            'w-[35px] h-[35px] flex justify-center items-center bg-transparent rounded-full cursor-pointer font-[\'Irish_Grover\'] text-white transition-all duration-300 ease-in-out',
            categoryPage === page ? 'bg-[#FEC564] text-white' : 'text-white'
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button 
        @click="categoryPage++"
        :disabled="categoryPage === totalCategoryPages"
        class="bg-[#FEC564] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Products Table Container -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px] overflow-x-auto">
      <div v-if="booksLoading" class="text-center py-8 text-gray-300">
        <h4 class="text-[#FEC564]">Loading books...</h4>
      </div>
      
      <div v-else-if="filteredBooks.length === 0" class="text-center py-8 text-gray-300">
        <h4>No books found</h4>
      </div>
      
      <table v-else class="w-full border-collapse bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.2)] relative max-[480px]:text-[14px]">
        <thead>
          <tr>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px]">ID</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px]">Name</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px]">Category</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px]">Price</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px]">Promo Price</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in paginatedBooks" :key="book.bookID">
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.bookID }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.bookName }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.categoryName }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.price }} G</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.proPrice || '-' }} G</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">
              <div class="flex gap-[15px] max-[480px]:gap-[10px]">
                <button 
                  @click="showDescription(book)" 
                  class="bg-[#FEC564] text-[#2D1A47] border-none py-[5px] px-[15px] rounded-[5px] cursor-pointer font-['Irish_Grover']"
                >
                  Show
                </button>
                <i 
                  @click="editBook(book)" 
                  class="fas fa-edit cursor-pointer text-[20px] text-[#2D1A47]"
                ></i>
                <i 
                  @click="confirmDelete(book.bookID)" 
                  class="fas fa-trash cursor-pointer text-[20px] text-[#ff4444]"
                ></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center my-5 mx-auto gap-[10px]">
      <button 
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="bg-[#FEC564] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div class="flex gap-[10px]">
        <button 
          v-for="page in pageNumbers" 
          :key="page"
          @click="currentPage = page"
          :class="[
            'w-[35px] h-[35px] flex justify-center items-center bg-transparent rounded-full cursor-pointer font-[\'Irish_Grover\'] text-white transition-all duration-300 ease-in-out',
            currentPage === page ? 'bg-[#FEC564] text-white' : 'text-white'
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button 
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="bg-[#FEC564] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Add Product Button (Fixed) -->
    <div class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100]">
      <button 
        @click="showAddModal = true"
        class="bg-[#FEC564] text-[#2D1A47] border-none py-3 px-[25px] rounded-[30px] cursor-pointer font-['Irish_Grover'] text-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_15px_rgba(0,0,0,0.4)] max-md:py-[10px] max-md:px-5 max-md:text-base"
      >
        Add Product
      </button>
    </div>

    <!-- Add/Edit Product Modal -->
    <div 
      v-if="showAddModal || editingBook" 
      class="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[1000]"
      @click="closeModal"
    >
      <div class="bg-[#2D1A47] text-[#FEC564] p-[30px] rounded-[10px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto font-['Irish_Grover'] relative" @click.stop>
        <button 
          @click="closeModal" 
          class="float-right text-[28px] cursor-pointer text-[#FEC564]"
        >
          &times;
        </button>
        <h3 class="mb-5">{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h3>
        
        <form @submit.prevent="editingBook ? updateBook() : addBook()">
          <div class="mb-5">
            <label class="block mb-[5px] text-[#FEC564]">Book Name</label>
            <input 
              type="text" 
              :value="editingBook ? editingBook.bookName : newBook.name"
              @input="editingBook ? editingBook.bookName = $event.target.value : newBook.name = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px]"
              required
            />
          </div>
          
          <div class="mb-5">
            <label class="block mb-[5px] text-[#FEC564]">Category</label>
            <select 
              :value="editingBook ? editingBook.categoryID : newBook.categoryID"
              @change="editingBook ? editingBook.categoryID = Number($event.target.value) : newBook.categoryID = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px]"
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
          
          <div class="mb-5">
            <label class="block mb-[5px] text-[#FEC564]">Description</label>
            <textarea 
              :value="editingBook ? editingBook.bookDescription : newBook.description"
              @input="editingBook ? editingBook.bookDescription = $event.target.value : newBook.description = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px]"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="mb-5">
            <label class="block mb-[5px] text-[#FEC564]">Price</label>
            <input 
              type="number" 
              :value="editingBook ? editingBook.price : newBook.price"
              @input="editingBook ? editingBook.price = $event.target.value : newBook.price = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px]"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div class="mb-5">
            <label class="block mb-[5px] text-[#FEC564]">Promotion Price</label>
            <input 
              type="number" 
              :value="editingBook ? editingBook.proPrice : newBook.proPrice"
              @input="editingBook ? editingBook.proPrice = $event.target.value : newBook.proPrice = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px]"
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="mb-5">
            <div class="flex items-center gap-[10px]">
              <label class="relative inline-block w-[50px] h-[28px] bg-[#2D1A47] rounded-[34px] transition-colors duration-300">
                <input 
                  type="checkbox" 
                  :checked="editingBook ? editingBook.isPromotionBook === 'true' : newBook.isPromotionBook === 'true'"
                  @change="handlePromotionToggle"
                  class="opacity-0 w-0 h-0"
                />
                <span :class="[
                  'absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[34px] transition-all duration-300',
                  (editingBook ? editingBook.isPromotionBook === 'true' : newBook.isPromotionBook === 'true') ? 'bg-[#FEC564]' : 'bg-[#452667]'
                ]">
                  <span :class="[
                    'absolute h-5 w-5 left-1 bottom-1 bg-[#FEC564] rounded-full transition-transform duration-300 flex items-center justify-center',
                    (editingBook ? editingBook.isPromotionBook === 'true' : newBook.isPromotionBook === 'true') ? 'translate-x-[22px] bg-[#2D1A47]' : ''
                  ]">
                    {{ (editingBook ? editingBook.isPromotionBook === 'true' : newBook.isPromotionBook === 'true') ? '🔮' : '✨' }}
                  </span>
                </span>
              </label>
              <span class="text-[#FEC564] font-['Irish_Grover'] text-[18px]">Is Promotion Book</span>
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
          
          <div class="flex justify-end gap-[15px] mt-5">
            <button 
              type="button" 
              @click="closeModal" 
              class="bg-[#777] text-white border-none py-[10px] px-5 rounded-[5px] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#FEC564] text-[#2D1A47] border-none py-[10px] px-5 rounded-[5px] cursor-pointer relative"
              :class="{ 'loading': editingBook ? saving : loading }"
              :disabled="editingBook ? saving : loading"
            >
              <span v-if="editingBook ? saving : loading" class="opacity-0">Save</span>
              <span v-else>{{ editingBook ? 'Save Changes' : 'Add Book' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[1000]"
      @click="showDeleteModal = false"
    >
      <div class="bg-[#2D1A47] text-[#FEC564] p-[30px] rounded-[10px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto font-['Irish_Grover'] relative" @click.stop>
        <button 
          @click="showDeleteModal = false" 
          class="float-right text-[28px] cursor-pointer text-[#FEC564]"
        >
          &times;
        </button>
        <h3 class="mb-5">Confirm Delete</h3>
        <p class="text-white mb-5">Are you sure you want to delete this book?</p>
        <div class="flex justify-end gap-[15px] mt-5">
          <button 
            @click="showDeleteModal = false" 
            class="bg-[#777] text-white border-none py-[10px] px-5 rounded-[5px] cursor-pointer"
          >
            Cancel
          </button>
          <button 
            @click="deleteBook(bookToDelete)"
            class="bg-[#FEC564] text-[#2D1A47] border-none py-[10px] px-5 rounded-[5px] cursor-pointer relative"
            :class="{ 'loading': deleting }"
            :disabled="deleting"
          >
            <span v-if="deleting" class="opacity-0">Delete</span>
            <span v-else>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Description Modal -->
    <div 
      v-if="showDescriptionModal && selectedBook" 
      class="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[1000]"
      @click="showDescriptionModal = false"
    >
      <div class="bg-[#2D1A47] text-[#FEC564] p-[30px] rounded-[10px] max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto font-['Irish_Grover']" @click.stop>
        <h3 class="mb-5">{{ selectedBook?.bookName }}</h3>
        <div class="my-5 text-white leading-[1.6] text-base">
          {{ selectedBook?.bookDescription || 'No description available.' }}
        </div>
        <div class="flex justify-end mt-5">
          <button 
            @click="showDescriptionModal = false"
            class="bg-[#FEC564] text-[#2D1A47] border-none py-[10px] px-5 rounded-[5px] cursor-pointer font-['Irish_Grover'] font-bold"
          >
            Close
          </button>
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
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const showDescriptionModal = ref(false)
    const selectedBook = ref(null)
    const bookToDelete = ref(null)
    const selectedCategory = ref(null)
    const categoryPage = ref(1)
    const currentPage = ref(1)
    const itemsPerPage = 10
    const categoriesPerPage = 10
    
    const newBook = ref({
      name: '',
      categoryID: '',
      description: '',
      price: '',
      proPrice: '',
      isPromotionBook: 'false'
    })

    const filteredBooks = computed(() => {
      if (!selectedCategory.value) return books.value
      return books.value.filter(book => book.categoryID === selectedCategory.value)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredBooks.value.length / itemsPerPage)
    })

    const pageNumbers = computed(() => {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    })

    const paginatedBooks = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredBooks.value.slice(start, end)
    })

    const totalCategoryPages = computed(() => {
      return Math.ceil(categories.value.length / categoriesPerPage)
    })

    const categoryPageNumbers = computed(() => {
      return Array.from({ length: totalCategoryPages.value }, (_, i) => i + 1)
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
          setTimeout(() => {
            closeModal()
          }, 1000)
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

    const closeModal = () => {
      editingBook.value = null
      showAddModal.value = false
      message.value = ''
    }

    const handlePromotionToggle = (event) => {
      const isChecked = event.target.checked
      if (editingBook.value) {
        editingBook.value.isPromotionBook = isChecked ? 'true' : 'false'
      } else {
        newBook.value.isPromotionBook = isChecked ? 'true' : 'false'
      }
    }

    const showDescription = (book) => {
      selectedBook.value = book
      showDescriptionModal.value = true
    }

    const confirmDelete = (bookId) => {
      bookToDelete.value = bookId
      showDeleteModal.value = true
    }

    const selectCategory = (categoryId) => {
      if (selectedCategory.value === categoryId) {
        selectedCategory.value = null
      } else {
        selectedCategory.value = categoryId
      }
      currentPage.value = 1
    }

    const editBook = (book) => {
      editingBook.value = {
        ...book,
        isPromotionBook: book.proPrice ? 'true' : 'false'
      }
      showAddModal.value = false
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
          await fetchBooks()
          setTimeout(() => {
            closeModal()
          }, 1000)
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
      deleting.value = true
      message.value = ''

      try {
        const response = await axios.delete(`/api/books/${bookId}`)

        if (response.data.success) {
          message.value = 'Book deleted successfully!'
          messageType.value = 'success'
          await fetchBooks()
          showDeleteModal.value = false
          bookToDelete.value = null
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
      showAddModal,
      showDeleteModal,
      showDescriptionModal,
      selectedBook,
      bookToDelete,
      selectedCategory,
      categoryPage,
      currentPage,
      filteredBooks,
      paginatedBooks,
      totalPages,
      pageNumbers,
      totalCategoryPages,
      categoryPageNumbers,
      addBook,
      editBook,
      closeModal,
      updateBook,
      deleteBook,
      handlePromotionToggle,
      showDescription,
      confirmDelete,
      selectCategory
    }
  }
}
</script>

<style scoped>
/* Loading spinner animation */
@keyframes button-loading-spinner {
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(1turn);
  }
}

button.loading::after {
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

button.loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

/* For save button with gold background */
button.loading.bg-\[#FEC564\]::after {
  border: 3px solid rgba(45, 26, 71, 0.3);
  border-top-color: #2D1A47;
}
</style>