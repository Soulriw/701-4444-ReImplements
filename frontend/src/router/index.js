import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AllProducts from '../views/AllProducts.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import SearchPage from '../views/SearchPage.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import CategoryPage from '../views/CategoryPage.vue'
import CategoryManagement from '../views/CategoryManagement.vue'
import ProductManagement from '../views/ProductManagement.vue'
import History from '../views/History.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/allProduct',
    name: 'AllProducts',
    component: AllProducts,
    meta: { requiresAuth: true }
  },
  {
    path: '/productDetail/:id?',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/searchPage',
    name: 'SearchPage',
    component: SearchPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/category/:id',
    name: 'CategoryPage',
    component: CategoryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/categoryManagement',
    name: 'CategoryManagement',
    component: CategoryManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/productManagement',
    name: 'ProductManagement',
    component: ProductManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Check authentication status
  let isAuthenticated = false
  let user = null
  let isAdmin = false
  
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      user = JSON.parse(userStr)
      isAuthenticated = true
      isAdmin = user?.isAdmin || false
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    localStorage.removeItem('user')
  }

  // Handle initial navigation
  if (to.path === '/login' && !isAuthenticated) {
    return next()
  }

  // Allow product detail page regardless of auth (handle both with and without params)
  if (to.path.startsWith('/productDetail')) {
    return next()
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }
  
  if (to.meta.requiresAdmin && !isAdmin) {
    next('/login')
    return
  }
  
  next()
})

export default router

