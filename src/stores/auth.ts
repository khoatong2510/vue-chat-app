import { defineStore } from 'pinia'
import authService from '@/services/amplify-auth'
import { type Store } from './types'
import type { Service } from '@/services/types'

interface AuthStoreState {
  user: Store.AuthStoreUser | null
  hasValidSession: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => {
    return {
      user: null,
      hasValidSession: false
    }
  },
  getters: {
    isAuth(state): boolean {
      return state.hasValidSession
    }
  },
  actions: {
    async getCurrentUser() {
      this.user = await authService.currentAuthUser()
    },
    async getCurrentSession() {
      this.hasValidSession = await authService.currentSession()
    },
    async signUp({ email, password }: Service.AuthInput) {
      await authService.handleSignUp({
        username: email,
        password
      })
    },
    async signIn({ email, password }: Service.AuthInput) {
      const isSignedIn = await authService.handleSignIn({
        username: email,
        password
      })

      if (!isSignedIn)
        return

      this.user = await authService.currentAuthUser()
    },
    async signOut() {
      await authService.handleSignOut()
    }
  }
})