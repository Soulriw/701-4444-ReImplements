<template>
  <div class="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-dark to-[#1a1a1a] relative pt-20">
    <div class="fixed inset-0 pointer-events-none z-0 bg-repeat opacity-100" :style="starsStyle"></div>
    <div class="w-full max-w-[400px] p-8 relative z-10">
      <div class="bg-white/5 border border-white/10 rounded-[20px] p-12 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.3)] max-md:p-8">
        <div class="text-center mb-8">
          <img src="/src/model/image/login/logofull.png" alt="Logo" class="max-w-[200px] h-auto mx-auto" />
        </div>
        
        <h2 class="text-gold text-center mb-8 text-3xl font-bold max-md:text-2xl">Join the Magic</h2>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <div class="relative flex items-center">
              <img src="/src/model/image/login/username.png" alt="Username" class="absolute left-4 w-5 h-5 z-10" />
              <input 
                type="text" 
                v-model="form.username" 
                placeholder="Username" 
                class="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-[10px] text-white text-base transition-all duration-300 focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)] placeholder-white/60"
                required
              />
            </div>
          </div>
          
          <div>
            <div class="relative flex items-center">
              <img src="/src/model/image/login/password.png" alt="Password" class="absolute left-4 w-5 h-5 z-10" />
              <input 
                type="password" 
                v-model="form.password" 
                placeholder="Password" 
                class="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-[10px] text-white text-base transition-all duration-300 focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)] placeholder-white/60"
                required
              />
            </div>
          </div>
          
          <div>
            <div class="relative flex items-center">
              <img src="/src/model/image/login/password.png" alt="Confirm Password" class="absolute left-4 w-5 h-5 z-10" />
              <input 
                type="password" 
                v-model="form.confirmPassword" 
                placeholder="Confirm Password" 
                class="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-[10px] text-white text-base transition-all duration-300 focus:outline-none focus:border-gold focus:shadow-[0_0_0_2px_rgba(254,197,100,0.2)] placeholder-white/60"
                required
              />
            </div>
          </div>
          
          <div v-if="errorMessage" class="bg-red/20 text-[#ff4444] p-4 rounded-md text-center border border-red/30">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="w-full px-8 py-4 bg-gold text-black border-none rounded-[10px] text-lg font-bold cursor-pointer transition-all duration-300 mb-4 hover:bg-[#ffd700] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(254,197,100,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="loading">Creating Account...</span>
            <span v-else>Register</span>
          </button>
        </form>
        
        <div class="text-center mt-8 text-gray-300">
          <p>Already have an account? <router-link to="/login" class="text-gold font-bold hover:underline">Login here</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      username: '',
      password: '',
      confirmPassword: ''
    })
    const loading = ref(false)
    const errorMessage = ref('')

    const starsStyle = {
      backgroundImage: `
        radial-gradient(2px 2px at 20px 30px, #fff, transparent),
        radial-gradient(2px 2px at 40px 70px, #fff, transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
        radial-gradient(1px 1px at 130px 80px, #fff, transparent),
        radial-gradient(2px 2px at 160px 30px, #fff, transparent)
      `,
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 100px',
      animation: 'sparkle 20s linear infinite'
    }

    const handleRegister = async () => {
      // Validate form
      if (!form.value.username || !form.value.password || !form.value.confirmPassword) {
        errorMessage.value = 'All fields are required'
        return
      }

      if (form.value.password !== form.value.confirmPassword) {
        errorMessage.value = 'Passwords do not match'
        return
      }

      if (form.value.password.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters long'
        return
      }

      loading.value = true
      errorMessage.value = ''
      
      try {
        const result = await authStore.register({
          username: form.value.username,
          password: form.value.password
        })
        
        if (result.success) {
          router.push('/')
        } else {
          errorMessage.value = result.error
        }
      } catch (error) {
        errorMessage.value = 'An unexpected error occurred'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      errorMessage,
      handleRegister,
      starsStyle
    }
  }
}
</script>