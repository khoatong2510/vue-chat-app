import { createRouter, createWebHistory, type RouteLocation } from 'vue-router'
import AppLayout from '@/pages/AppLayout.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import HomePage from '@/pages/home-page/HomePage.vue'
import FriendView from '@/pages/home-page/views/FriendView.vue'
import ChatView from '@/pages/home-page/views/ChatView.vue'
import CreateProfilePage from '@/pages/CreateProfilePage.vue'
import TestContainer from '@/pages/TestContainer.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserProfileStore } from '@/stores/profile'
import TestEmoji from '@/pages/TestEmoji.vue'
import { chatGuard } from './guards'

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
      path: '/test',
      name: 'test',
      component: TestContainer
    },
    {
      path: '/test-emoji',
      name: 'test-emoji',
      component: TestEmoji
    },
    {
      path: '/',
      name: 'layout',
      component: AppLayout,
      children: [
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
                  component: FriendView
                },
                {
                  path: '/chat/:id?',
                  name: 'chat',
                  component: ChatView,
                  beforeEnter: chatGuard
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
