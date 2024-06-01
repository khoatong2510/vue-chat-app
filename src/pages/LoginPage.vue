<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import InputField from '@/components/InputField.vue'


interface LoginPageState {
  email: string
  password: string
}

const state: LoginPageState = reactive({
  email: '',
  password: ''
})


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
  
  if (!isValid)
    return
  // calling api here

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

</script>

<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
    <div class="bg-slate-100 w-4/5 h-4/5 shadow-xl rounded-3xl p-8 flex items-center justify-end login-page-bg-image">
      <div class="w-1/2 flex flex-col gap-4 justify-center">
        <div class="font-bold text-2xl">
          Welcome!
        </div>

        <div>
          <a class="underline font-semibold cursor-pointer hover:text-orange-400" href="/register">Create a new account</a> 
          or login to get started using Chat App
        </div>

        <div class="flex flex-col gap-4">
          <InputField 
            v-model="state.email"
            type="email"
            label="Email"
            :error="emailErrorMessage"
          />

          <InputField
            v-model="state.password"
            type="password"
            label="Password"
            :error="passwordErrorMessage"
          />

          <a class="block w-full text-right underline cursor-pointer hover:text-orange-400">
            Forgot Password?
          </a>

          <button 
            class="w-full rounded-2xl bg-slate-600 text-white py-2 hover:bg-slate-700 active:bg-slate-500 transition-colors duration-75 ease-in" 
            @click="login"
          >
            Login
          </button>
        </div>
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