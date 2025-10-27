import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AllProducts from '../views/AllProducts.vue'
// import ProductDetail from '../views/ProductDetail.vue'
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
  // {
  //   path: '/productDetail',
  //   name: 'ProductDetail',
  //   component: ProductDetail,
  //   meta: { requiresAuth: true }
  // },
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
  const isAuthenticated = localStorage.getItem('user') !== null
  const user = isAuthenticated ? JSON.parse(localStorage.getItem('user')) : null
  const isAdmin = user?.isAdmin

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/login')
  } else {
    next()
  }
})

export default router

