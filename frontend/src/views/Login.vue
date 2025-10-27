<template>
  <!-- Login page with purple background, centered container -->
  <div class="min-h-screen flex flex-col justify-center items-center bg-[#432667] m-0 pb-0">
    <!-- Main container with flex column layout -->
    <div class="flex flex-col items-center w-[99%] flex-grow justify-center">
      <!-- Title with golden color and styling - responsive font size -->
      <h1 class="text-[#FEC564] text-4xl max-[440px]:text-3xl tracking-wide mb-2.5 pt-9 font-['Irish_Grover']">
        Welcome back
      </h1>
      
      <!-- Divider line - responsive width -->
      <div class="w-1/2 max-[440px]:w-4/5 h-[1.5px] bg-[#FEC564] my-2.5 clear-both"></div>
      
      <!-- Login box container - responsive layout changes on mobile -->
      <div class="flex max-[440px]:flex-col w-full max-w-[670px] max-[440px]:max-w-[85%] h-[460px] max-[440px]:h-[500px] max-[440px]:bg-white rounded-[25px] border-3 border-white shadow-lg mt-4 overflow-hidden">
        <!-- Logo section on the left - hidden on mobile -->
        <div class="bg-black w-[45%] max-[440px]:w-0 max-[440px]:h-0 flex flex-col justify-center items-center overflow-hidden">
          <div class="flex flex-col items-center justify-center text-white h-full w-full">
            <!-- Logo image - hidden on mobile, fills available space with padding -->
            <img src="/src/model/image/login/logofull.png" alt="Logo" class="h-full w-full object-contain max-[440px]:hidden" />
          </div>
        </div>
        
        <!-- Form section on the right - full width on mobile -->
        <div class="bg-white w-[55%] max-[440px]:w-[88%] h-full p-10 max-[440px]:p-0 max-[440px]:mt-[60px] max-[440px]:ml-5 flex flex-col justify-center">
          <form @submit.prevent="handleLogin">
            <!-- Username input group - responsive width and spacing on mobile -->
            <div class="relative mb-[65px] max-[440px]:mb-[60px] max-[440px]:w-4/5 max-[440px]:ml-[30px] flex items-center border-b border-gray-300 pb-1.5">
              <img src="/src/model/image/login/username.png" alt="Username" class="w-[35px] h-[35px]" />
              <input 
                type="text" 
                v-model="form.username" 
                placeholder="Username" 
                class="w-full border-none outline-none py-2 text-base ml-2.5"
                required
              />
            </div>
            
            <!-- Password input group - responsive width and spacing on mobile -->
            <div class="relative mb-5 max-[440px]:w-4/5 max-[440px]:ml-[30px] -mt-6 flex items-center border-b border-gray-300 pb-1.5">
              <img src="/src/model/image/login/password.png" alt="Password" class="w-[35px] h-[35px]" />
              <input 
                type="password" 
                v-model="form.password" 
                placeholder="Password" 
                class="w-full border-none outline-none py-2 text-base ml-2.5"
                required
              />
            </div>
            
            <!-- Error message display -->
            <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2.5 mb-4 rounded-md text-center">
              {{ errorMessage }}
            </div>
            
            <!-- Login button - responsive sizing on mobile -->
            <button 
              type="submit" 
              class="bg-gray-200 text-gray-800 border-none rounded-[25px] py-3 max-[440px]:py-2.5 max-[440px]:mb-5 w-[55%] max-[440px]:w-[56%] text-base max-[440px]:text-xl font-black cursor-pointer mt-10 max-[440px]:mt-5 transition-colors duration-300 mx-auto block hover:bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="loading">LOGGING IN...</span>
              <span v-else>LOG IN</span>
            </button>
          </form>
          
          <!-- Register link section - responsive text size on mobile -->
          <div class="text-center mt-8 max-[440px]:mt-5 max-[440px]:-ml-1.5">
            <p class="text-gray-500 text-base max-[440px]:text-2xl mb-1">do not have an account? <router-link to="/register" class="text-[#FEC564] text-base max-[440px]:text-2xl hover:underline font-bold">Register now</router-link></p>
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
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Form data with username and password
    const form = ref({
      username: '',
      password: ''
    })
    // Loading state for button disabled state
    const loading = ref(false)
    // Error message for displaying login errors
    const errorMessage = ref('')

    // Handle login form submission
    const handleLogin = async () => {
      loading.value = true
      errorMessage.value = ''
      
      try {
        const result = await authStore.login(form.value)
        
        if (result.success) {
          // Redirect based on user type
          if (authStore.isAdmin) {
            router.push('/categoryManagement')
          } else {
            router.push('/')
          }
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
      handleLogin
    }
  }
}
</script>

<style scoped>
/* Mobile responsive styles using Tailwind utilities */
@media screen and (max-width: 440px) {
  /* Note: Most responsive styles are now handled by Tailwind classes */
  /* Custom styles can be added here if needed beyond Tailwind capabilities */
}
</style>

