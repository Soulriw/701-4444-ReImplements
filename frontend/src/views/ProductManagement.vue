<template>
  <!-- Home page with gradient background -->
  <div class="relative pt-0 pb-32" style="min-height: 100vh; background: linear-gradient(180deg, #2D1A47 0%, #2D1A47 10%, #432667 30%, #693467 55%, #8B4365 70%, #B65C56 85%, #FEC564 100%); background-size: 100% 100%; background-attachment: fixed;">
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
    <div class="relative z-[500] pt-[70px]">
      <h1 class="text-[#FEC564] text-center mb-8 text-4xl lg:pt-2 lg:text-3xl lg:mb-6 md:pt-2 md:text-2xl md:mb-6 sm:text-2xl max-[480px]:pt-2 max-[480px]:text-xl max-[480px]:mb-5 max-[375px]:pt-2 max-[375px]:text-lg max-[375px]:mb-4 max-[375px]:p-[6px]">Product Management</h1>

       <!-- Divider line -->
    <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both lg:my-8 md:my-7 max-[480px]:my-6 max-[480px]:w-[90%] max-[375px]:my-4 max-[375px]:w-[95%]"></div>


    <!-- Category Container -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px] max-md:px-[10px] max-[480px]:px-[8px]">
      <div class="flex gap-[15px] pb-[10px] justify-center flex-wrap max-md:gap-[10px] max-[480px]:gap-[8px]">
        <div 
          v-for="category in paginatedCategories" 
          :key="category.categoryID"
          @click="selectCategory(category.categoryID)"
          :class="[
            'bg-white text-black py-[12px] px-[20px] rounded-[10px] cursor-pointer transition-all duration-300 ease-in-out font-[\'Irish_Grover\'] text-[18px] text-center flex-1 min-w-[120px] max-md:py-[8px] max-md:px-4 max-md:min-w-[100px] max-md:text-base max-md:flex-[1_1_calc(50%-5px)] max-[480px]:min-w-[90px] max-[480px]:text-[14px] max-[480px]:py-[6px] max-[480px]:px-3 max-[480px]:flex-[1_1_100%] max-[375px]:text-[12px] max-[375px]:py-[5px] max-[375px]:px-2',
            selectedCategory === category.categoryID ? 'bg-[#FEC564] text-black' : 'hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]'
          ]"
        >
          {{ category.categoryName }}
        </div>
      </div>
    </div>

    <!-- Category Pagination -->
    <div v-if="totalCategoryPages > 1" class="flex justify-center items-center my-5 mx-auto gap-[10px] max-md:gap-[8px] max-[480px]:gap-[6px] max-[480px]:my-4 max-[375px]:gap-[4px] max-[375px]:my-3">
      <button 
        @click="categoryPage--"
        :disabled="categoryPage === 1"
        class="bg-[#666] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed hover:bg-[#777] max-md:py-[6px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[5px] max-[480px]:px-3 max-[480px]:text-[12px] max-[480px]:rounded-[15px] max-[375px]:py-[4px] max-[375px]:px-2 max-[375px]:text-[11px]"
      >
        Prev
      </button>
      <div class="flex gap-[10px] max-md:gap-[8px] max-[480px]:gap-[6px] max-[375px]:gap-[4px]">
        <button 
          v-for="page in categoryPageNumbers" 
          :key="page"
          @click="categoryPage = page"
          :class="[
            'w-[35px] h-[35px] flex justify-center items-center rounded-full cursor-pointer font-[\'Irish_Grover\'] text-white transition-all duration-300 ease-in-out max-md:w-[30px] max-md:h-[30px] max-md:text-[14px] max-[480px]:w-[28px] max-[480px]:h-[28px] max-[480px]:text-[12px] max-[375px]:w-[26px] max-[375px]:h-[26px] max-[375px]:text-[11px]',
            categoryPage === page ? 'bg-[#FEC564] text-white' : 'bg-[#2D1A47] text-white hover:bg-[#432667]'
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button 
        @click="categoryPage++"
        :disabled="categoryPage === totalCategoryPages"
        class="bg-[#FEC564] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed hover:bg-[#FFD700] max-md:py-[6px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[5px] max-[480px]:px-3 max-[480px]:text-[12px] max-[480px]:rounded-[15px] max-[375px]:py-[4px] max-[375px]:px-2 max-[375px]:text-[11px]"
      >
        Next
      </button>
    </div>

    <!-- Divider line -->
    <div class="w-4/5 h-0.5 bg-[#FEC564] my-10 mx-auto clear-both lg:my-8 md:my-7 max-[480px]:my-6 max-[480px]:w-[90%] max-[375px]:my-4 max-[375px]:w-[95%]"></div>


    <!-- Products Table Container -->
    <div class="max-w-[1200px] mx-auto my-5 px-[15px] overflow-x-auto">
      <div v-if="booksLoading" class="text-center py-8 text-gray-300">
        <h4 class="text-[#FEC564]">Loading books...</h4>
      </div>
      
      <table v-else-if="filteredBooks.length > 0" class="text-black w-full border-collapse bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.2)] relative max-[480px]:text-[14px] max-[375px]:text-[12px]">
        <thead>
          <tr>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Name</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px] max-[375px]:hidden">Category</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Price</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:hidden">Promo Price</th>
            <th class="bg-[#FEC564] text-[#2D1A47] p-[15px] text-left font-['Irish_Grover'] text-[20px] max-md:p-[10px] max-md:text-[16px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in paginatedBooks" :key="book.bookID">
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.bookName }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:hidden" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.categoryName }}</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.price }} G</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:hidden" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">{{ book.proPrice || '-' }} G</td>
            <td class="p-[15px] border-b border-[#eee] font-['Irish_Grover'] max-md:p-[10px] max-[480px]:p-[8px] max-[480px]:text-[14px] max-[375px]:p-[6px] max-[375px]:text-[12px]" :class="{ 'border-b-0': index === paginatedBooks.length - 1 }">
              <div class="flex gap-[15px] max-md:gap-[10px] max-[480px]:gap-[8px] max-[375px]:gap-[6px] max-[375px]:flex-col">
                <button 
                  @click="showDescription(book)" 
                  class="bg-[#FEC564] text-[#2D1A47] border-none py-[5px] px-[15px] rounded-[5px] cursor-pointer font-['Irish_Grover'] max-md:py-[4px] max-md:px-[12px] max-md:text-[14px] max-[480px]:py-[3px] max-[480px]:px-[10px] max-[480px]:text-[12px] max-[375px]:py-[3px] max-[375px]:px-[8px] max-[375px]:text-[11px]"
                >
                  Show
                </button>
                <i 
                  @click="editBook(book)" 
                  class="fas fa-edit cursor-pointer text-[20px] text-[#2D1A47] max-md:text-[18px] max-[480px]:text-[16px] max-[375px]:text-[14px]"
                ></i>
                <i 
                  @click="confirmDelete(book.bookID)" 
                  class="fas fa-trash cursor-pointer text-[20px] text-[#ff4444] max-md:text-[18px] max-[480px]:text-[16px] max-[375px]:text-[14px]"
                ></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Pagination -->
    <div v-if="totalPages > 1" class="flex flex-wrap justify-center items-center my-5 mx-auto gap-[10px] max-md:gap-[6px] max-[480px]:gap-[4px] max-[480px]:my-4 max-[375px]:gap-[3px] max-[375px]:my-3 px-[10px] max-[480px]:px-[5px]">
      <button 
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="bg-[#FEC564] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed disabled:opacity-50 max-md:py-[5px] max-md:px-3 max-md:text-[13px] max-md:rounded-[15px] max-[480px]:py-[4px] max-[480px]:px-2.5 max-[480px]:text-[11px] max-[480px]:rounded-[12px] max-[375px]:py-[3px] max-[375px]:px-2 max-[375px]:text-[10px] max-[375px]:rounded-[10px]"
      >
        <span class="max-[480px]:hidden">Previous</span>
        <span class="hidden max-[480px]:inline">Prev</span>
      </button>
      <div class="flex flex-wrap justify-center gap-[10px] max-md:gap-[5px] max-[480px]:gap-[3px] max-[375px]:gap-[2px]">
        <button 
          v-for="page in pageNumbers" 
          :key="page"
          @click="currentPage = page"
          :class="[
            'w-[35px] h-[35px] flex justify-center items-center bg-transparent rounded-full cursor-pointer font-[\'Irish_Grover\'] text-white transition-all duration-300 ease-in-out hover:bg-[#FEC564]/30 max-md:w-[28px] max-md:h-[28px] max-md:text-[13px] max-[480px]:w-[24px] max-[480px]:h-[24px] max-[480px]:text-[11px] max-[375px]:w-[22px] max-[375px]:h-[22px] max-[375px]:text-[10px]',
            currentPage === page ? 'bg-[#FEC564] text-white font-bold' : 'text-white'
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button 
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="bg-[#FEC564] text-white border-none py-2 px-5 rounded-[20px] cursor-pointer font-['Irish_Grover'] transition-all duration-300 ease-in-out disabled:bg-[#666] disabled:cursor-not-allowed disabled:opacity-50 max-md:py-[5px] max-md:px-3 max-md:text-[13px] max-md:rounded-[15px] max-[480px]:py-[4px] max-[480px]:px-2.5 max-[480px]:text-[11px] max-[480px]:rounded-[12px] max-[375px]:py-[3px] max-[375px]:px-2 max-[375px]:text-[10px] max-[375px]:rounded-[10px]"
      >
        Next
      </button>
    </div>

    <!-- Add Product Button (Fixed) -->
    <div class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] max-md:bottom-4 max-[480px]:bottom-3 max-[375px]:bottom-2">
      <button 
        @click="showAddModal = true"
        class="bg-[#FEC564] text-[#2D1A47] border-none py-3 px-[25px] rounded-[30px] cursor-pointer font-['Irish_Grover'] text-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_15px_rgba(0,0,0,0.4)] max-md:py-[10px] max-md:px-5 max-md:text-base max-md:rounded-[25px] max-[480px]:py-[8px] max-[480px]:px-4 max-[480px]:text-[14px] max-[480px]:rounded-[20px] max-[375px]:py-[6px] max-[375px]:px-3 max-[375px]:text-[12px] max-[375px]:rounded-[15px]"
      >
        Add Product
      </button>
    </div>

    <!-- Add/Edit Product Modal -->
    <div 
      v-if="showAddModal || editingBook" 
      class="pt-20 fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[9999] max-md:p-[10px] max-[480px]:p-[8px] max-[375px]:p-[5px]"
      @click="closeModal"
    >
      <div class="bg-[#2D1A47] text-[#FEC564] p-[30px] rounded-[10px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto font-['Irish_Grover'] relative max-md:p-[20px] max-md:max-w-[450px] max-[480px]:p-[15px] max-[480px]:max-w-[400px] max-[375px]:p-[12px] max-[375px]:max-w-[350px]" @click.stop>
        <button 
          @click="closeModal" 
          class="float-right text-[28px] cursor-pointer text-[#FEC564] max-md:text-[24px] max-[480px]:text-[20px] max-[375px]:text-[18px]"
        >
          &times;
        </button>
        <h3 class="mb-5 max-md:mb-4 max-md:text-[18px] max-[480px]:mb-3 max-[480px]:text-[16px] max-[375px]:mb-2 max-[375px]:text-[14px]">{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h3>
        
        <form @submit.prevent="editingBook ? updateBook() : addBook()">
          <div class="mb-5 max-md:mb-4 max-[480px]:mb-3 max-[375px]:mb-2">
            <label class="block mb-[5px] text-[#FEC564] max-md:text-[16px] max-[480px]:text-[14px] max-[375px]:text-[12px]">Book Name</label>
            <input 
              type="text" 
              :value="editingBook ? editingBook.bookName : newBook.name"
              @input="editingBook ? editingBook.bookName = $event.target.value : newBook.name = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px] max-md:p-[8px] max-md:text-[14px] max-[480px]:p-[6px] max-[480px]:text-[12px] max-[375px]:p-[5px] max-[375px]:text-[11px]"
              required
            />
          </div>
          
          <div class="mb-5 max-md:mb-4 max-[480px]:mb-3 max-[375px]:mb-2">
            <label class="block mb-[5px] text-[#FEC564] max-md:text-[16px] max-[480px]:text-[14px] max-[375px]:text-[12px]">Category</label>
            <select 
              :value="editingBook ? editingBook.categoryID : newBook.categoryID"
              @change="editingBook ? editingBook.categoryID = Number($event.target.value) : newBook.categoryID = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px] max-md:p-[8px] max-md:text-[14px] max-[480px]:p-[6px] max-[480px]:text-[12px] max-[375px]:p-[5px] max-[375px]:text-[11px]"
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
          
          <div class="mb-5 max-md:mb-4 max-[480px]:mb-3 max-[375px]:mb-2">
            <label class="block mb-[5px] text-[#FEC564] max-md:text-[16px] max-[480px]:text-[14px] max-[375px]:text-[12px]">Description</label>
            <textarea 
              :value="editingBook ? editingBook.bookDescription : newBook.description"
              @input="editingBook ? editingBook.bookDescription = $event.target.value : newBook.description = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px] max-md:p-[8px] max-md:text-[14px] max-[480px]:p-[6px] max-[480px]:text-[12px] max-[375px]:p-[5px] max-[375px]:text-[11px]"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="mb-5 max-md:mb-4 max-[480px]:mb-3 max-[375px]:mb-2">
            <label class="block mb-[5px] text-[#FEC564] max-md:text-[16px] max-[480px]:text-[14px] max-[375px]:text-[12px]">Price</label>
            <input 
              type="number" 
              :value="editingBook ? editingBook.price : newBook.price"
              @input="editingBook ? editingBook.price = $event.target.value : newBook.price = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px] max-md:p-[8px] max-md:text-[14px] max-[480px]:p-[6px] max-[480px]:text-[12px] max-[375px]:p-[5px] max-[375px]:text-[11px]"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div class="mb-5 max-md:mb-4 max-[480px]:mb-3 max-[375px]:mb-2">
            <label class="block mb-[5px] text-[#FEC564] max-md:text-[16px] max-[480px]:text-[14px] max-[375px]:text-[12px]">Promotion Price</label>
            <input 
              type="number" 
              :value="editingBook ? editingBook.proPrice : newBook.proPrice"
              @input="editingBook ? editingBook.proPrice = $event.target.value : newBook.proPrice = $event.target.value"
              class="w-full p-[10px] border border-[#452667] bg-[#3D2657] text-white rounded-[5px] max-md:p-[8px] max-md:text-[14px] max-[480px]:p-[6px] max-[480px]:text-[12px] max-[375px]:p-[5px] max-[375px]:text-[11px]"
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="mb-5 max-md:mb-4 max-[480px]:mb-3 max-[375px]:mb-2">
            <div class="flex items-center gap-[10px] max-md:gap-[8px] max-[480px]:gap-[6px] max-[375px]:gap-[4px]">
              <label class="relative inline-block w-[50px] h-[28px] bg-[#2D1A47] rounded-[34px] transition-colors duration-300 max-md:w-[45px] max-md:h-[25px] max-[480px]:w-[40px] max-[480px]:h-[22px] max-[375px]:w-[35px] max-[375px]:h-[20px]">
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
                    'absolute h-5 w-5 left-1 bottom-1 bg-[#FEC564] rounded-full transition-transform duration-300 flex items-center justify-center max-md:h-4 max-md:w-4 max-[480px]:h-[18px] max-[480px]:w-[18px] max-[375px]:h-3 max-[375px]:w-3',
                    (editingBook ? editingBook.isPromotionBook === 'true' : newBook.isPromotionBook === 'true') ? 'translate-x-[22px] bg-[#2D1A47] max-md:translate-x-[21px] max-[480px]:translate-x-[18px] max-[375px]:translate-x-[15px]' : ''
                  ]">
                    {{ (editingBook ? editingBook.isPromotionBook === 'true' : newBook.isPromotionBook === 'true') ? '🔮' : '✨' }}
                  </span>
                </span>
              </label>
              <span class="text-[#FEC564] font-['Irish_Grover'] text-[18px] max-md:text-[16px] max-[480px]:text-[14px] max-[375px]:text-[12px]">Is Promotion Book</span>
            </div>
          </div>
          
          <div 
            v-if="message" 
            class="p-4 rounded mb-4 text-center font-bold max-md:p-3 max-md:text-[14px] max-[480px]:p-2 max-[480px]:text-[12px] max-[375px]:p-1.5 max-[375px]:text-[11px]"
            :class="{
              'bg-green/20 text-green border border-green/30': messageType === 'success',
              'bg-red/20 text-[#ff4444] border border-red/30': messageType === 'error'
            }"
          >
            {{ message }}
          </div>
          
          <div class="flex justify-end gap-[15px] mt-5 max-md:gap-[12px] max-md:mt-4 max-[480px]:gap-[10px] max-[480px]:mt-3 max-[375px]:gap-[8px] max-[375px]:mt-2">
            <button 
              type="button" 
              @click="closeModal" 
              class="bg-[#777] text-white border-none py-[10px] px-5 rounded-[5px] cursor-pointer max-md:py-[8px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[6px] max-[480px]:px-3 max-[480px]:text-[12px] max-[375px]:py-[5px] max-[375px]:px-2 max-[375px]:text-[11px]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#FEC564] text-[#2D1A47] border-none py-[10px] px-5 rounded-[5px] cursor-pointer relative max-md:py-[8px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[6px] max-[480px]:px-3 max-[480px]:text-[12px] max-[375px]:py-[5px] max-[375px]:px-2 max-[375px]:text-[11px]"
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
      class="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[9999] max-md:p-[10px] max-[480px]:p-[8px] max-[375px]:p-[5px]"
      @click="showDeleteModal = false"
    >
      <div class="bg-[#2D1A47] text-[#FEC564] p-[30px] rounded-[10px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto font-['Irish_Grover'] relative max-md:p-[20px] max-md:max-w-[450px] max-[480px]:p-[15px] max-[480px]:max-w-[400px] max-[375px]:p-[12px] max-[375px]:max-w-[350px]" @click.stop>
        <button 
          @click="showDeleteModal = false" 
          class="float-right text-[28px] cursor-pointer text-[#FEC564] max-md:text-[24px] max-[480px]:text-[20px] max-[375px]:text-[18px]"
        >
          &times;
        </button>
        <h3 class="mb-5 max-md:mb-4 max-md:text-[18px] max-[480px]:mb-3 max-[480px]:text-[16px] max-[375px]:mb-2 max-[375px]:text-[14px]">Confirm Delete</h3>
        <p class="text-white mb-5 max-md:mb-4 max-md:text-[14px] max-[480px]:mb-3 max-[480px]:text-[12px] max-[375px]:mb-2 max-[375px]:text-[11px]">Are you sure you want to delete this book?</p>
        <div class="flex justify-end gap-[15px] mt-5 max-md:gap-[12px] max-md:mt-4 max-[480px]:gap-[10px] max-[480px]:mt-3 max-[375px]:gap-[8px] max-[375px]:mt-2">
          <button 
            @click="showDeleteModal = false" 
            class="bg-[#777] text-white border-none py-[10px] px-5 rounded-[5px] cursor-pointer max-md:py-[8px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[6px] max-[480px]:px-3 max-[480px]:text-[12px] max-[375px]:py-[5px] max-[375px]:px-2 max-[375px]:text-[11px]"
          >
            Cancel
          </button>
          <button 
            @click="deleteBook(bookToDelete)"
            class="bg-[#FEC564] text-[#2D1A47] border-none py-[10px] px-5 rounded-[5px] cursor-pointer relative max-md:py-[8px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[6px] max-[480px]:px-3 max-[480px]:text-[12px] max-[375px]:py-[5px] max-[375px]:px-2 max-[375px]:text-[11px]"
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
      class="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[9999] max-md:p-[10px] max-[480px]:p-[8px] max-[375px]:p-[5px]"
      @click="showDescriptionModal = false"
    >
      <div class="bg-[#2D1A47] text-[#FEC564] p-[30px] rounded-[10px] max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto font-['Irish_Grover'] max-md:p-[20px] max-md:max-w-[450px] max-[480px]:p-[15px] max-[480px]:max-w-[400px] max-[375px]:p-[12px] max-[375px]:max-w-[350px]" @click.stop>
        <h3 class="mb-5 max-md:mb-4 max-md:text-[18px] max-[480px]:mb-3 max-[480px]:text-[16px] max-[375px]:mb-2 max-[375px]:text-[14px]">{{ selectedBook?.bookName }}</h3>
        <div class="my-5 text-white leading-[1.6] text-base max-md:text-[14px] max-[480px]:text-[12px] max-[375px]:text-[11px]">
          {{ selectedBook?.bookDescription || 'No description available.' }}
        </div>
        <div class="flex justify-end mt-5 max-md:mt-4 max-[480px]:mt-3 max-[375px]:mt-2">
          <button 
            @click="showDescriptionModal = false"
            class="bg-[#FEC564] text-[#2D1A47] border-none py-[10px] px-5 rounded-[5px] cursor-pointer font-['Irish_Grover'] font-bold max-md:py-[8px] max-md:px-4 max-md:text-[14px] max-[480px]:py-[6px] max-[480px]:px-3 max-[480px]:text-[12px] max-[375px]:py-[5px] max-[375px]:px-2 max-[375px]:text-[11px]"
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
    const categoriesPerPage = 3

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

    const paginatedCategories = computed(() => {
      const start = (categoryPage.value - 1) * categoriesPerPage
      const end = start + categoriesPerPage
      return categories.value.slice(start, end)
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
      paginatedCategories,
      addBook,
      editBook,
      closeModal,
      updateBook,
      deleteBook,
      handlePromotionToggle,
      showDescription,
      confirmDelete,
      selectCategory,
      confettiDots
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