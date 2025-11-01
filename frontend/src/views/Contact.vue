<template>
  <div class="py-8 min-h-[80vh] pt-[120px] relative">
    <div class="fixed inset-0 pointer-events-none z-0 bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #fff, transparent), radial-gradient(2px 2px at 40px 70px, #fff, transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent); background-repeat: repeat; background-size: 200px 100px;"></div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="w-full">
        <h1 class="text-gold text-4xl mb-8 text-center">Contact Us</h1>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/3">
          <div class="bg-white/5 border border-white/10 rounded-[10px] p-8 mb-8">
            <h3 class="text-gold mb-6 text-xl">Send us a Message</h3>
            <form @submit.prevent="handleSubmit">
              <div class="mb-6">
                <label for="name" class="text-gold font-bold mb-2 block">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  required
                />
              </div>
              
              <div class="mb-6">
                <label for="email" class="text-gold font-bold mb-2 block">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  required
                />
              </div>
              
              <div class="mb-6">
                <label for="subject" class="text-gold font-bold mb-2 block">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  required
                />
              </div>
              
              <div class="mb-6">
                <label for="message" class="text-gold font-bold mb-2 block">Message</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  class="w-full px-3 py-3 bg-white/10 border border-white/20 rounded text-white text-base focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)]"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div 
                v-if="message" 
                class="p-4 rounded-md mb-4 text-center font-bold"
                :class="{
                  'bg-green/20 text-green border border-green/30': messageType === 'success',
                  'bg-red/20 text-[#ff4444] border border-red/30': messageType === 'error'
                }"
              >
                {{ message }}
              </div>
              
              <button 
                type="submit" 
                class="w-full px-8 py-4 bg-gold text-black border-none rounded-[10px] text-lg font-bold cursor-pointer transition-all duration-300 hover:bg-[#ffd700] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(254,197,100,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                <span v-if="loading">Sending...</span>
                <span v-else>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        <div class="lg:w-1/3">
          <div class="bg-white/5 border border-white/10 rounded-[10px] p-8">
            <h3 class="text-gold mb-6 text-xl">Get in Touch</h3>
            
            <div class="flex items-center mb-6">
              <img src="/src/model/image/contact/mail.png" alt="Email" class="w-10 h-10 mr-4" />
              <div>
                <h4 class="text-gold mb-1 text-lg">Email</h4>
                <p class="text-gray-300 m-0">info@quadgrimoire.com</p>
              </div>
            </div>
            
            <div class="flex items-center mb-6">
              <img src="/src/model/image/contact/facebook.png" alt="Facebook" class="w-10 h-10 mr-4" />
              <div>
                <h4 class="text-gold mb-1 text-lg">Facebook</h4>
                <p class="text-gray-300 m-0">@QuadGrimoire</p>
              </div>
            </div>
            
            <div class="flex items-center mb-6">
              <img src="/src/model/image/contact/twitter.png" alt="Twitter" class="w-10 h-10 mr-4" />
              <div>
                <h4 class="text-gold mb-1 text-lg">Twitter</h4>
                <p class="text-gray-300 m-0">@QuadGrimoire</p>
              </div>
            </div>
            
            <div class="flex items-center mb-6">
              <img src="/src/model/image/contact/Instagram.png" alt="Instagram" class="w-10 h-10 mr-4" />
              <div>
                <h4 class="text-gold mb-1 text-lg">Instagram</h4>
                <p class="text-gray-300 m-0">@QuadGrimoire</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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