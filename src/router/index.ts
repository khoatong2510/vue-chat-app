import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import CreateProfilePage from '@/pages/CreateProfilePage.vue'
import FriendSuggestionPage from '@/pages/FriendSuggestionPage.vue'
import AppEntry from '@/pages/AppEntry.vue'
import { useAuthStore } from '@/stores/auth'

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
      name: 'app-entry',
      component: AppEntry,
      meta: {
        authRequired: true
      },
      children: [
        {
          path: '/create-profile',
          name: 'create-profile',
          component: CreateProfilePage,
          meta: {
            authRequired: true
          }
        },
        {
          path: '/friend-suggestion',
          name: 'friend-suggestion',
          component: FriendSuggestionPage,
          meta: {
            authRequired: true
          }
        }
      ]
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.getCurrentSession()

  if (!to.meta.authRequired)
    next()

  if (to.meta.authRequired && authStore.isAuth) {
    await authStore.getCurrentUser()
    next()
  } else
    next({ name: 'login' })
})

export default router
