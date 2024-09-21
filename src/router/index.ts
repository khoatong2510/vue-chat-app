import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import HomePage from '@/pages/home-page/HomePage.vue'
import CreateProfilePage from '@/pages/CreateProfilePage.vue'
import FriendSuggestionPage from '@/pages/FriendSuggestionPage.vue'

import { useAuthStore } from '@/stores/auth'
import { useUserProfileStore } from '@/stores/profile'

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
  const userProfileStore = useUserProfileStore()
  await authStore.getCurrentSession()

  if (authStore.isAuth) {
    await authStore.getCurrentUser()

    if (authStore.user)
      await userProfileStore.getUserProfile(authStore.user.userId)

    next()
  }
  else if (to.name === 'login' || to.name === 'register') {
    next()
  } else {
    next({ name: 'login' })
  }
})

export default router
