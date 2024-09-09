<script setup lang="ts">
import ProfileImage from '@/components/ProfileImage.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import Contact from './Contact.vue'



</script>

<template>
  <div v-bind="$attrs"
    class="rounded-xl border border-solid border-blue-100 bg-blue-100 bg-opacity-50 shadow-lg flex flex-col gap-4">
    <div class="px-4 pt-4 flex items-center justify-between">
      <div class=" text-xl font-semibold">
        Contacts
      </div>

      <div class="w-12 h-12 
          rounded-full p-2 
          flex items-center justify-center cursor-pointer 
          hover:bg-gray-200 hover:shadow-md
          hover:text-slate-600 active:bg-slate-400  active:text-white
          duration-150
          ">
        <PencilSquareIcon class="w-6 h-6" />
      </div>
    </div>

    <div class="flex items-center justify-center cursor-pointer gap-2 px-2">
      <div class="
          flex-1 text-center font-semibold text-lg py-1 
          bg-indigo-200 bg-opacity-60
          rounded-lg
          hover:bg-indigo-200 hover:bg-opacity-50 hover:shadow
          active:bg-indigo-300 active:bg-opacity-50 active:shadow-none
          duration-100
          ">
        Messages
      </div>

      <div class="
          flex-1 text-center font-semibold text-lg py-1 
          bg-transparent
          rounded-lg
          hover:bg-indigo-200 hover:bg-opacity-50 hover:shadow
          active:bg-indigo-300 active:bg-opacity-50 active:shadow-none
          duration-100">
        Requests
      </div>
    </div>

    <div class="p-2 w-full h-full flex flex-col gap-y-2">
      <Contact class="bg-indigo-200 bg-opacity-50 shadow-md" name="John Doe"
        avatar-url="src/assets/images/785-200x200.jpg"
        last-message="Quis nostrum exercitationem ullam corporis suscipit" last-message-at="now" />

      <Contact class="bg-slate-200 bg-opacity-50 shadow-sm" name="Amelia Ferguson"
        avatar-url="src/assets/images/184-200x200.jpg"
        last-message="The Harriet Series is a serif typeface family designed by Jackson Cavanaugh and released through"
        last-message-at="8m" />

      <Contact class="bg-slate-200 bg-opacity-50 shadow-sm" name="Eva Roberts"
        avatar-url="src/assets/images/23-200x200.jpg"
        last-message="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system"
        last-message-at="10m" />
    </div>
  </div>
</template>

<style lang="postcss"></style>