import { defineStore } from 'pinia'
import authService from '@/services/auth'
import type { AuthInput } from '@/services/types'

interface AuthStoreState {
  accessToken: string | null
  idToken: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      idToken: localStorage.getItem('idToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    }
  },
  getters: {
    isAuth(state): boolean {
      return !!state.idToken && !!state.accessToken && !!state.refreshToken
    }
  },
  actions: {
    signUp({ email, password }: AuthInput) {
      return authService.signUp({ email, password })
    },
    async initiateAuth ({ email, password }: AuthInput) {
      const res = await authService.initiateAuth({ email, password })

      if (!res.AuthenticationResult)
        return

      const { AccessToken, IdToken, RefreshToken } = res.AuthenticationResult
      
      if (AccessToken) {
        this.accessToken = AccessToken
        localStorage.setItem('accessToken', AccessToken)
      }

      if (IdToken) {
        this.idToken = IdToken
        localStorage.setItem('idToken', IdToken)
      }

      if (RefreshToken) {
        this.refreshToken = RefreshToken
        localStorage.setItem('refreshToken', RefreshToken)
      }
    },
    async signOut() {
      if(this.accessToken !== null)
        await authService.signOut(this.accessToken)

      this.accessToken = null
      this.idToken = null
      this.refreshToken = null

      localStorage.removeItem('accessToken')
      localStorage.removeItem('idToken')
      localStorage.removeItem('refreshToken')
    }
  }
})