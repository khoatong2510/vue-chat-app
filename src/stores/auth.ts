import { defineStore } from 'pinia'
import authService from '@/services/amplify-auth'
import { type Store } from './types'
import type { Service } from '@/services/types'


export const useAuthStore = defineStore('auth', {
  state: (): Store.AuthStoreState => {
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

      if (this.hasValidSession)
        this.user = await authService.currentAuthUser()
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