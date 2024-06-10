import { defineStore } from 'pinia'
import authService from '@/services/auth'
import type { AuthInput } from '@/services/types'

interface AuthStoreState {
  accessToken: string|null
  idToken: string|null
  refreshToken: string|null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => {
    return {
      accessToken: null,
      idToken: null,
      refreshToken: null,
    }
  },
  actions: {
    signUp({ email, password }: AuthInput) {
      return authService.signUp({ email, password })
    },
    async initiateAuth({ email, password }: AuthInput) {
      const res = await authService.initiateAuth({ email, password })

      console.log(res)
      if (res.AuthenticationResult) {
        this.accessToken = res.AuthenticationResult.AccessToken || null
        this.idToken = res.AuthenticationResult.IdToken || null
        this.refreshToken = res.AuthenticationResult.RefreshToken || null
      }
    }
  }
})