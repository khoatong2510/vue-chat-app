<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

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

const emailErrorMessage = computed(() => {
  
  if (v$.value.email.$errors.length !== 0)
    return v$.value.email.$errors[0].$message

  return ''
})

const passwordErrorMessage = computed(() => {
  if (v$.value.password.$errors.length !== 0)
    return v$.value.password.$errors[0].$message

  return ''
})

</script>

<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
    <div class="bg-slate-50 w-4/5 h-4/5 shadow-xl rounded-3xl p-8 flex items-center justify-center gap-x-4">
      <div class="flex-1 h-full">
        <img :src="'/src/assets/svg/undraw_beach_day_cser.svg'" class="w-full h-full">
      </div>

      <div class="flex-2 flex flex-col gap-4 justify-center">
        <div class="font-bold text-2xl">
          Welcome!
        </div>

        <div>
          <a class="underline font-semibold cursor-pointer hover:text-orange-400" href="/register">Create a new account</a> 
          or login to get started using Chat App
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <div class="text-sm">
              Email
            </div>
            
            <input 
              v-model="state.email"
              type="email"
              class="
                w-full p-2 mt-2 
                border border-solid border-slate-200 focus:outline-none focus:border-sky-500 
                rounded-md
              "
              :class="emailErrorMessage ? 'border-red-500' : ''"
            />

            <span class="text-sm text-red-500">{{ emailErrorMessage }}</span>
          </div>

          <div>
            <div class="text-sm">
              Password
            </div>
            
            <input 
              v-model="state.password"
              type="password"
              class="w-full p-2 mt-2 border border-solid border-slate-200 focus:outline-none focus:border-sky-500 rounded-md " 
              :class="passwordErrorMessage ? 'border-red-500' : ''"
            />

            <span class="text-sm text-red-500">{{ passwordErrorMessage }}</span>
          </div>

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

