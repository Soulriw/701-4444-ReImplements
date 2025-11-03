<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative pb-20 max-md:pb-16 max-[480px]:pb-12 max-[375px]:pb-10" style="background: linear-gradient(180deg, #2D1A47 0%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500] font-['Arial',sans-serif] max-w-[1200px] mx-auto pt-[80px] mb-[50px] max-[1024px]:max-w-[90%] max-[1024px]:pt-[60px] max-[1024px]:mb-[40px] max-[440px]:pt-[40px] max-[440px]:mb-[30px]" style="border-top: none;">
    <h1 class="pt-[10px] font-['Irish_Grover'] text-center text-[#FEC564] text-5xl mb-5 mt-[10px] lg:text-4xl md:text-3xl md:mt-5 sm:text-3xl max-[480px]:text-2xl max-[375px]:text-xl">Contact Us</h1>
    
    <div class="flex bg-white rounded-[30px] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.1)] w-full max-md:flex-col max-[440px]:rounded-[20px]">
      <!-- Map Container -->
      <div class="w-[70%] relative p-5 flex flex-col max-md:w-full max-[440px]:p-[15px]">
        <div id="map" class="w-full h-[700px] rounded-[8px] bg-[#f0f0f0] max-[1024px]:h-[600px] max-md:h-[400px] max-[375px]:h-[300px]"></div>
        <div class="mt-[30px] mb-[15px] max-md:mt-5">
          <p class="text-black font-bold">Address</p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="mt-10 w-[30%] pt-5 pr-5 flex flex-col gap-[15px] max-md:w-full max-md:mt-0 max-[1024px]:mt-10 max-[440px]:p-[15px]">
        <h3 class="font-['Arial',sans-serif] pt-[10px] flex justify-center text-black text-2xl font-bold">Send Email</h3>
        
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-[15px]">
          
          <div class="relative mb-[15px] text-black">
            <img src="/src/model/image/contact/mail.png" alt="Email" class="absolute top-1/2 left-[10px] -translate-y-1/2 w-5 h-5 max-[375px]:w-4 max-[375px]:h-4" />
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              placeholder="Email"
              class="w-full py-[12px] pl-[40px] pr-[12px] border border-[#ddd] rounded-[5px] text-base max-[440px]:text-[0.9rem] max-[375px]:py-[10px] max-[375px]:pl-[35px] max-[375px]:pr-[10px]"
              required
            />
          </div>
          
          <div class="relative mb-[15px] text-black">
            <img src="/src/model/image/contact/subject.png" alt="Subject" class="absolute top-1/2 left-[10px] -translate-y-1/2 w-5 h-5 max-[375px]:w-4 max-[375px]:h-4" />
            <input 
              type="text" 
              id="subject" 
              v-model="form.subject" 
              placeholder="Subject"
              class="w-full py-[12px] pl-[40px] pr-[12px] border border-[#ddd] rounded-[5px] text-base max-[440px]:text-[0.9rem] max-[375px]:py-[10px] max-[375px]:pl-[35px] max-[375px]:pr-[10px]"
              required
            />
          </div>
          
          <div class="relative mb-[15px] h-[120px] text-black">
            <textarea 
              id="message" 
              v-model="form.message" 
              placeholder="Message"
              class="w-full h-full py-[12px] px-[12px] border border-[#ddd] rounded-[5px] resize-none text-base max-[440px]:text-[0.9rem]"
              required
            ></textarea>
          </div>
          
          <div 
            v-if="message" 
            class="p-4 rounded-md mb-4 text-center font-bold text-black"
            :class="{
              'bg-green/20 text-green border border-green/30': messageType === 'success',
              'bg-red/20 text-[#ff4444] border border-red/30': messageType === 'error'
            }"
          >
            {{ message }}
          </div>
          
          <div class="flex justify-center items-center w-full mt-[10px]">
            <button 
              type="submit" 
              class="bg-[#333] text-white border-none rounded-[25px] py-3 cursor-pointer text-base transition-[background-color] duration-300 ease-in-out w-[120px] hover:bg-[#555] disabled:opacity-60 disabled:cursor-not-allowed max-[440px]:w-full max-[375px]:py-[10px] max-[375px]:px-[15px] max-[375px]:text-[0.9rem] mx-auto"
              :disabled="loading"
            >
              <span v-if="loading">Sending...</span>
              <span v-else>Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer with Social Icons -->
    <footer class="mb-16 max-md:mb-12 max-[480px]:mb-10 max-[375px]:mb-8">
      <div class="flex justify-center gap-[15px] mt-[15px] max-[440px]:gap-[10px]">
        <div class="transition-transform duration-300 ease-in-out hover:scale-110">
          <img src="/src/model/image/contact/facebook.png" alt="Facebook" class="w-[60px] h-[60px] max-[440px]:w-[50px] max-[440px]:h-[50px] max-[375px]:w-[30px] max-[375px]:h-[30px]" />
        </div>
        <div class="transition-transform duration-300 ease-in-out hover:scale-110">
          <img src="/src/model/image/contact/twitter.png" alt="Twitter" class="w-[60px] h-[60px] max-[440px]:w-[50px] max-[440px]:h-[50px] max-[375px]:w-[30px] max-[375px]:h-[30px]" />
        </div>
        <div class="transition-transform duration-300 ease-in-out hover:scale-110">
          <img src="/src/model/image/contact/Instagram.png" alt="Instagram" class="w-[60px] h-[60px] max-[440px]:w-[50px] max-[440px]:h-[50px] max-[375px]:w-[30px] max-[375px]:h-[30px]" />
        </div>
      </div>
    </footer>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'Contact',
  setup() {
    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    const loading = ref(false)
    const message = ref('')
    const messageType = ref('')

    const handleSubmit = async () => {
      loading.value = true
      message.value = ''
      
      try {
        const response = await axios.post('/api/contact', form.value)
        
        if (response.data.success) {
          message.value = 'Message sent successfully!'
          messageType.value = 'success'
          form.value = { name: '', email: '', subject: '', message: '' }
        } else {
          message.value = response.data.error || 'Failed to send message'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = 'An error occurred while sending the message'
        messageType.value = 'error'
      } finally {
        loading.value = false
        
        // Clear message after 5 seconds
        setTimeout(() => {
          message.value = ''
        }, 5000)
      }
    }

    return {
      form,
      loading,
      message,
      messageType,
      handleSubmit
    }
  }
}
</script>