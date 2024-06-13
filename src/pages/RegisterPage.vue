<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, minLength, sameAs } from '@vuelidate/validators'
import { hasUpperCase, hasNumber, hasSpecialCharacter } from '@/custom-validators'
import InputField from '@/components/InputField.vue'
import Spinner from '@/components/Spinner.vue'
import type { CognitoIdentityProviderServiceException } from '@aws-sdk/client-cognito-identity-provider'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'


interface RegisterPageState {
  email: string
  password: string
  confirmPassword: string
}

const authStore = useAuthStore()
const router = useRouter()

const state: RegisterPageState = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Must be an email', email)
  },
  password: {
    required: helpers.withMessage('Password is required', required),
    hasUpperCase: helpers.withMessage(
      'Password must have at least one Uppercase character',
      hasUpperCase
    ),
    hasNumber: helpers.withMessage('Password must contain number characters', hasNumber),
    hasSpecialCharacter: helpers.withMessage(
      'Password must contain at least one special character ',
      hasSpecialCharacter
    ),
    minLength: helpers.withMessage('Password must have at least 8 characters', minLength(8))
  },
  confirmPassword: {
    required: helpers.withMessage('Confirm Password is required', required),
    sameAsPassword: helpers.withMessage(
      'Confirm Password does not match',
      sameAs(computed(() => state.password))
    )
  }
}

const v$ = useVuelidate(rules, state)
const isLoading = ref(false)
const isSucceeded = ref(false)

const emailFrontEndErrorMessage = computed<string | null>(() => {
  if (v$.value.email.$errors.length !== 0) return v$.value.email.$errors[0].$message.toString()

  return null
})

const emailBackendError = ref<string>('')

const emailBackendErrorMessage = computed<string | null>(() => {
  if (emailBackendError.value === '') return null

  if (emailBackendError.value === 'UsernameExistsException') return 'Email is existed'
  else return 'There is something while creating your account'
})

const passwordErrorMessage = computed<string | null>(() => {
  if (v$.value.password.$errors.length !== 0)
    return v$.value.password.$errors[0].$message.toString()

  return null
})

const confirmPasswordErrorMessage = computed<string | null>(() => {
  if (v$.value.confirmPassword.$errors.length !== 0)
    return v$.value.confirmPassword.$errors[0].$message.toString()

  return null
})

const register = async () => {
  isLoading.value = true

  const isValid = await v$.value.$validate()

  if (!isValid) return

  try {
    await authStore.signUp({ 
      email: state.email, 
      password: state.password 
    })

    isLoading.value = false

    // success
    isSucceeded.value = true
  } catch (error) {
    emailBackendError.value = (error as CognitoIdentityProviderServiceException).name
    isLoading.value = false
  }

  // go back to login page

  // handling error
}

const backToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
    <div
      class="bg-slate-100 w-4/5 h-4/5 shadow-xl rounded-3xl p-8 flex items-center justify-end gap-x-4 register-page-bg-image"
    >
      <div 
        v-if="!isSucceeded" 
        class="w-1/2 flex flex-col gap-4 justify-center"
      >
        <div class="font-bold text-2xl">Create an account</div>

        <div>Sign up to get started!</div>

        <div class="flex flex-col gap-4">
          <InputField
            v-model="state.email"
            label="Email"
            type="email"
            :error="emailFrontEndErrorMessage || emailBackendErrorMessage"
          />

          <InputField
            v-model="state.password"
            label="Password"
            type="password"
            :error="passwordErrorMessage"
          />

          <InputField
            v-model="state.confirmPassword"
            label="Confirm Password"
            type="password"
            :error="confirmPasswordErrorMessage"
          />

          <button
            class="mt-2 w-full rounded-2xl bg-slate-600 text-white py-2 hover:bg-slate-700 active:bg-slate-500 transition-colors duration-75 ease-in flex items-center justify-center"
            @click="register"
          >
            <Spinner v-if="isLoading" class="h-5 w-5" />

            <span v-else> Register </span>
          </button>
        </div>
      </div>

      <div v-else class="w-1/2 flex flex-col justify-center items-center gap-y-4">
        <div class="flex justify-center items-center gap-x-2">
          <CheckCircleIcon class="w-8 h-8 text-green-500" />
          We just sent you an email to verify account
        </div>

        <button
          class="mt-2 w-auto rounded-2xl bg-slate-600 text-white px-4 py-2 hover:bg-slate-700 active:bg-slate-500 transition-colors duration-75 ease-in flex items-center justify-center"
          @click="backToLogin"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.register-page-bg-image {
  background-image: url('/src/assets/svg/undraw_blooming_re_2kc4.svg');
  background-repeat: no-repeat;
  background-origin: content-box;
  background-position: left;
  background-size: 45% 100%;
}
</style>
