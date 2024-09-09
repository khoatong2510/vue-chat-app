import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import HomePage from '@/pages/home-page/HomePage.vue'
import { useAuthStore } from '@/stores/auth'
import CreateProfilePage from '@/pages/CreateProfilePage.vue'
import FriendSuggestionPage from '@/pages/FriendSuggestionPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/create-profile',
      name: 'create-profile',
      component: CreateProfilePage
    },
    {
      path: '/friend-suggestion',
      name: 'friend-suggestion',
      component: FriendSuggestionPage
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.getCurrentSession()

  if (authStore.isAuth || to.name === 'login' || to.name === 'register') {
    next()
  } else {
    next({ name: 'login' })
  }
})

export default router
