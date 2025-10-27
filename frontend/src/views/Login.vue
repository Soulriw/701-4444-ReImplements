<template>
  <div class="login-page">
    <div class="stars" :style="starsStyle"></div>
    <div class="login-container">
      <div class="login-form">
        <div class="logo-container">
          <img src="/src/model/image/login/logofull.png" alt="Logo" class="logo" />
        </div>
        
        <h2 class="login-title">Welcome Back</h2>
        
        <form @submit.prevent="handleLogin" class="form">
          <div class="form-group">
            <div class="input-container">
              <img src="/src/model/image/login/username.png" alt="Username" class="input-icon" />
              <input 
                type="text" 
                v-model="form.username" 
                placeholder="Username" 
                class="form-input"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-container">
              <img src="/src/model/image/login/password.png" alt="Password" class="input-icon" />
              <input 
                type="password" 
                v-model="form.password" 
                placeholder="Password" 
                class="form-input"
                required
              />
            </div>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="login-btn"
            :disabled="loading"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>
        
        <div class="register-link">
          <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
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
    
    const form = ref({
      username: '',
      password: ''
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
      handleLogin,
      starsStyle
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.login-form {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  max-width: 200px;
  height: auto;
}

.login-title {
  color: #FEC564;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  width: 20px;
  height: 20px;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #FEC564;
  box-shadow: 0 0 0 2px rgba(254, 197, 100, 0.2);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.login-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: #FEC564;
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.login-btn:hover:not(:disabled) {
  background: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(254, 197, 100, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.register-link {
  text-align: center;
  color: #ccc;
}

.register-link a {
  color: #FEC564;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

@keyframes sparkle {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100px);
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-form {
    padding: 2rem 1.5rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}
</style>

