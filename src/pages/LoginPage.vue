<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import InputField from '@/components/InputField.vue'
import Spinner from '@/components/Spinner.vue'
import Button from '@/components/Button.vue'
import { useAuthStore } from '@/stores/auth';
import type { CognitoIdentityProviderServiceException } from '@aws-sdk/client-cognito-identity-provider';
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

interface LoginPageState {
  email: string
  password: string
}

const state: LoginPageState = reactive({
  email: '',
  password: ''
})

const backendError = ref('')
const isLoading = ref(false)

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Not an email', email)
  },
  password: {
    required: helpers.withMessage('Password is required', required)
  }
}

const v$ = useVuelidate(rules, state)

const login = async (): Promise<void> => {
  const isValid = await v$.value.$validate()

  if (!isValid) return
  
  //loading here
  isLoading.value = true

  try {
    await authStore.signOut()

    await authStore.signIn({
      email: state.email,
      password: state.password
    })

    if (!authStore.user)
      throw new Error("User Data not found")
    
    isLoading.value = false

    router.push({ name: 'home' })
  } catch (error) {
    backendError.value = (error as CognitoIdentityProviderServiceException).name
    isLoading.value = false
  }
}

const emailFrontEndErrorMessage = computed<string | null>(() => {
  if (v$.value.email.$errors.length !== 0) return v$.value.email.$errors[0].$message.toString()

  return null
})

const backendErrorMessage = computed<string | null>(() => {
  if (backendError.value === '')
    return null

  if (backendError.value === 'UserNotConfirmedException') 
    return 'Your account has not confirmed yet'

  if (backendError.value === 'UserNotFoundException')
    return 'Account not exist'

  return 'Something wrong, we cannot log you in'
})


const passwordErrorMessage = computed<string | null>(() => {
  if (v$.value.password.$errors.length !== 0)
    return v$.value.password.$errors[0].$message.toString()

  return null
})
</script>

<template>
  <div
    class="bg-surfaceContainer shadow-lg shadow-surfaceLow rounded-3xl p-8 flex items-center justify-center"
  >
    <div class="flex flex-col gap-2 justify-center">
      <div class="font-bold text-2xl">Welcome!</div>

      <div>
        <a 
          class="underline font-semibold cursor-pointer text-onPrimaryContainer hover:text-opacity-75" 
          href="/register"
        >
          Create a new account
        </a>
        or login to get started using Chat App
      </div>

      <div class="flex flex-col gap-4">
        <InputField 
          v-model="state.email"
          type="email" 
          label="Email" 
          :error="emailFrontEndErrorMessage || backendErrorMessage" 
        />

        <InputField
          v-model="state.password"
          type="password"
          label="Password"
          :error="passwordErrorMessage"
        />

        <a class="block w-full text-right underline cursor-pointer text-onPrimaryContainer hover:text-opacity-75 text-sm">
          Forgot Password?
        </a>

        <Button
          type="primary" 
          class="py-2"
          @click="login"
        >
          <Spinner 
            v-if="isLoading"
            class="h-5 w-5" 
          />
          
          <span v-else> Login </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style>
.login-page-bg-image {
  background-image: url('/src/assets/svg/undraw_beach_day_cser.svg');
  background-repeat: no-repeat;
  background-origin: content-box;
  background-position: left;
  background-size: 45% 100%;
}
</style>
