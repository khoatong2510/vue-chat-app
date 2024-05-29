<script setup lang="ts">
import { ref } from 'vue'

// const userEmail = ref('')
// const userPassword = ref('')

// const rules = {
//   userEmail: { required, email },
//   userPassword: { required }
// }

// const v$ = useVuelidate(rules, { userEmail, userPassword })


</script>

<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
    <div class="bg-slate-50 w-4/5 h-4/5 shadow-xl rounded-3xl p-4 flex items-center justify-center gap-x-2">
      <div class="lg:flex-2 md:flex-1 h-full">
        <img :src="'/src/assets/svg/undraw_beach_day_cser.svg'" class="w-full h-full">
      </div>

      <div class="flex-1 flex flex-col gap-4 justify-center">
        <div class="font-semibold text-2xl">
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
              class="w-full p-2 mt-2 border border-solid border-slate-200 focus:outline-none focus:border-sky-500 rounded-md " 4
            />
          </div>

          <div>
            <div class="text-sm">
              Password
            </div>
            
            <input 
              class="w-full p-2 mt-2 border border-solid border-slate-200 focus:outline-none focus:border-sky-500 rounded-md " 
            />
          </div>

          <a class="block w-full text-right underline cursor-pointer">
            Forgot Password?
          </a>

          <button 
            class="w-full rounded-2xl bg-slate-500 text-white py-2 hover:bg-slate-600" 
          >
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

