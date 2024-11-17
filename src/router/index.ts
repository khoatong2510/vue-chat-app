import { createRouter, createWebHistory, type RouteLocation } from 'vue-router'
import AppLayout from '@/pages/AppLayout.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import HomePage from '@/pages/home-page/HomePage.vue'
import FriendPage from '@/pages/home-page/views/FriendPage.vue'
import ChatPage from '@/pages/home-page/views/ChatPage.vue'
import CreateProfilePage from '@/pages/CreateProfilePage.vue'
import ColorPalette from '@/pages/ColorPalette.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserProfileStore } from '@/stores/profile'

const validateUserSession = async (to: RouteLocation, from: RouteLocation, next: Function) => {
  const authStore = useAuthStore()

  await authStore.getCurrentSession()
  if (!to.meta.authRequired)
    next()

  if (authStore.isAuth) {
    await authStore.getCurrentUser()

    if (!authStore.user?.userId) {
      next({ name: 'login' })
      return
    }

    next()

  } else
    next({ name: 'login' })
}

const validateUserProfile = async (to: RouteLocation, from: RouteLocation, next: Function) => {
  const authStore = useAuthStore()
  const userProfileStore = useUserProfileStore()

  if (to.name === "create-profile") {
    next()
    return
  }

  const userId = authStore.user?.userId
  if (!userId) {
    next({ name: 'login' })
    return
  }

  await userProfileStore.getUserProfile(userId)

  if (!userProfileStore.userProfile) {
    next({ name: 'create-profile' })
    return
  }

  if (to.name === 'app-entry') {
    next({ name: 'home' })
  }

  userProfileStore.listenFriendRequest()

  next()
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: AppLayout,
      children: [
        {
          path: '/color-palette',
          name: 'color-palette',
          component: ColorPalette
        },
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
          meta: {
            authRequired: true
          },
          beforeEnter: [validateUserSession, validateUserProfile],
          children: [
            {
              path: '/create-profile',
              name: 'create-profile',
              component: CreateProfilePage,
            },
            {
              path: '/home',
              name: 'home',
              component: HomePage,
              children: [
                {
                  path: '/friends',
                  name: 'friend',
                  component: FriendPage
                },
                {
                  path: '/chat/:id?',
                  name: 'chat',
                  component: ChatPage
                }
              ]
            }
          ]
        },
      ]
    }
  ]
})



export default router
