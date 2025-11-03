<template>
  <!-- Home page with gradient background -->
  <div class="min-h-screen relative" style="background: linear-gradient(180deg, #2D1A47 0%, #432667 40%, #693467 65%, #8B4365 80%, #B65C56 90%, #FEC564 100%);">
    
    <!-- Stars background animation layer -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-repeat opacity-100" 
         style="background-image: radial-gradient(2px 2px at 20px 30px, #FEC564, transparent), radial-gradient(2px 2px at 40px 70px, #FEC564, transparent), radial-gradient(1px 1px at 90px 40px, #FEC564, transparent), radial-gradient(1px 1px at 130px 80px, #FEC564, transparent), radial-gradient(2px 2px at 160px 30px, #FEC564, transparent); background-size: 200px 100px;"></div>
    
    <!-- Content with padding for navbar -->
    <div class="relative z-[500] flex justify-center items-start pt-20 min-h-screen">
    <div class="flex flex-col items-center w-[99%] h-full">
      <h1 class="text-[#FEC564] text-[2.5rem] tracking-[2px] mb-[10px] pt-[35px] max-[440px]:text-[2rem] text-center" style="font-family: 'Irish Grover', sans-serif;">
        CREATE AN ACCOUNT
      </h1>
      <div class="w-[80%] h-[1.5px] bg-[#FEC564] my-[10px] mb-[30px] max-[440px]:w-[80%]"></div>
      
      <div class="flex w-full max-w-[670px] h-[460px] rounded-[25px] border-[3px] border-white overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.3)] mt-[15px] max-[440px]:flex-col max-[440px]:h-[500px] max-[440px]:w-[85%] max-[440px]:bg-white max-[440px]:rounded-[30px]">
        <!-- Logo Section -->
        <div class="bg-[#000000] w-[45%] flex flex-col justify-center items-center shrink-0 max-[440px]:w-0 max-[440px]:h-0 max-[440px]:hidden">
          <div class="w-[400px] h-[420px] mt-[10px] bg-black rounded-[20px] overflow-hidden flex items-center justify-center">
            <img src="/src/Model/image/login/logofull.png" alt="Logo" class="w-full h-full object-contain rounded-[20px]" />
          </div>
        </div>
        
        <!-- Form Section -->
        <div class="bg-white w-[55%] h-[480px] px-[30px] py-[40px] flex flex-col justify-center shrink-0 max-[440px]:w-[88%] max-[440px]:h-[350px] max-[440px]:px-0 max-[440px]:py-0 max-[440px]:mt-[60px] max-[440px]:ml-[20px]">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-[#ffdddd] text-[#ff0000] p-[10px] mb-[15px] rounded-[5px] text-center">
            {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleRegister" class="flex flex-col">
            <!-- Username Input -->
            <div class="relative mb-[65px] flex items-center border-b border-[#ddd] pb-[5px] max-[440px]:w-[80%] max-[440px]:ml-[30px] max-[440px]:mb-[60px]">
              <img src="/src/Model/image/login/username.png" alt="Username" class="w-[35px] h-[35px] shrink-0" />
              <input 
                type="text" 
                v-model="form.username" 
                placeholder="Username" 
                class="w-full border-none outline-none py-[8px] text-base ml-[10px] bg-transparent text-black"
                required
              />
            </div>
            
            <!-- Password Input -->
            <div class="relative mb-[20px] -mt-[25px] flex items-center border-b border-[#ddd] pb-[5px] max-[440px]:w-[80%] max-[440px]:ml-[30px]">
              <img src="/src/Model/image/login/password.png" alt="Password" class="w-[35px] h-[35px] shrink-0" />
              <input 
                type="password" 
                v-model="form.password" 
                placeholder="Password" 
                class="w-full border-none outline-none py-[8px] text-base ml-[10px] bg-transparent text-black"
                required
              />
            </div>
            
            <!-- Confirm Password Input -->
            <div class="relative mb-[20px] flex items-center border-b border-[#ddd] pb-[5px] max-[440px]:w-[80%] max-[440px]:ml-[30px]">
              <img src="/src/Model/image/login/password.png" alt="Confirm Password" class="w-[35px] h-[35px] shrink-0" />
              <input 
                type="password" 
                v-model="form.confirmPassword" 
                placeholder="Confirm Password" 
                class="w-full border-none outline-none py-[8px] text-base ml-[10px] bg-transparent text-black"
                required
              />
            </div>
            
            <!-- Register Button -->
            <button 
              type="submit" 
              class="bg-[#e3e3e3] text-[#333] border-none rounded-[25px] py-[12px] px-0 w-[55%] text-base font-[900] cursor-pointer mt-[40px] transition-[background-color] duration-300 mx-auto block hover:bg-[#d4d4d4] disabled:opacity-60 disabled:cursor-not-allowed max-[440px]:text-[1.25rem] max-[440px]:w-[56%] max-[440px]:mb-[20px] max-[440px]:flex max-[440px]:flex-col max-[440px]:justify-center max-[440px]:items-center max-[440px]:py-[10px]"
              :disabled="loading"
            >
              <span v-if="loading">Creating Account...</span>
              <span v-else>REGISTER</span>
            </button>
          </form>
          
          <!-- Register Link -->
          <div class="text-center mt-[30px] max-[440px]:mt-[20px] max-[440px]:-ml-[5px]">
            <p class="text-[#777] text-base mb-[5px] max-[440px]:text-[1.5rem]">already have an account?</p>
            <router-link to="/login" class="text-[#ffb347] text-base font-bold hover:underline max-[440px]:text-[1.5rem]">Log in</router-link>
          </div>
        </div>
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
      handleRegister
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Irish Grover');
</style>
