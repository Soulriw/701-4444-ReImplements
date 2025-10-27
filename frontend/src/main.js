import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores'

// Import Tailwind CSS
import '../style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth before mounting to ensure guards work properly
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
