<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, minLength, sameAs } from '@vuelidate/validators'
import { hasUpperCase, hasNumber, hasSpecialCharacter } from '@/custom-validators'
import InputField from '@/components/InputField.vue'

interface RegisterPageState {
  email: string,
  password: string,
  confirmPassword: string
}

const state: RegisterPageState = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  email: { 
    required: helpers.withMessage("Email is required", required), 
    email: helpers.withMessage("Must be an email", email)
  },
  password: { 
    required: helpers.withMessage("Password is required", required),
    hasUpperCase: helpers.withMessage("Password must have at least one Uppercase character", hasUpperCase),
    hasNumber: helpers.withMessage("Password must contain number characters", hasNumber),
    hasSpecialCharacter: helpers.withMessage("Password must contain at least one special character ", hasSpecialCharacter),
    minLength: helpers.withMessage("Password must have at least 8 characters", minLength(8)),
  },
  confirmPassword: {
    required: helpers.withMessage("Confirm Password is required", required),
    sameAs: helpers.withMessage("Confirm Password does not match", sameAs(state.password))
  }
}

const v$ = useVuelidate(rules, state)

const register = async () => {
  const isValid = await v$.value.$validate()

  if (!isValid)
    return

  console.log('register')
}

const emailErrorMessage = computed<string|null>(() => {
  if (v$.value.email.$errors.length !== 0)
    return v$.value.email.$errors[0].$message.toString()

  return null
})

const passwordErrorMessage = computed<string|null>(() => {
  if (v$.value.password.$errors.length !== 0)
    return v$.value.password.$errors[0].$message.toString()

  return null
})

const confirmPasswordErrorMessage = computed<string|null>(() => {
  if (v$.value.confirmPassword.$errors.length !== 0)
    return v$.value.confirmPassword.$errors[0].$message.toString()

  return null
})


</script>

<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
    <div class="bg-slate-100 w-4/5 h-4/5 shadow-xl rounded-3xl p-8 flex items-center justify-end gap-x-4 register-page-bg-image">       
      <div class="w-1/2 flex flex-col gap-4 justify-center">
        <div class="font-bold text-2xl">
          Create an account
        </div>

        <div>
          Sign up to get started!
        </div>

        <div class="flex flex-col gap-4">
          <InputField 
            v-model="state.email"
            label="Email"
            type="email"
            :error="emailErrorMessage"
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
            class="
              mt-2
              w-full rounded-2xl 
              bg-slate-600 text-white py-2 
              hover:bg-slate-700 
              active:bg-slate-500 
              transition-colors duration-75 ease-in
            " 
            @click="register"
          >
            Register
          </button>
        </div>
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