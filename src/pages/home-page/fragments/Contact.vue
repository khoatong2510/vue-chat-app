<script setup lang="ts">
import ProfileImage from '@/components/ProfileImage.vue'

interface ContactProps {
  name: string
  avatarUrl: string
  lastMessage: string
  lastMessageAt: string
}

const props = defineProps<ContactProps>()
</script>

<template>
  <div v-bind="$attrs" class="
      flex gap-2 items-start justify-start cursor-pointer 
    hover:bg-indigo-200 hover:bg-opacity-50 hover:shadow-md duration-100
      active:bg-indigo-200 active:bg-opacity-70 active:shadow-none
      rounded-lg p-2
    ">
    <ProfileImage :src="props.avatarUrl" :size="9" />

    <div class="grid grid-rows-2 grid-cols-2">
      <div class="font-semibold leading-tight row-start-1 col-span-2">
        {{ props.name }}
      </div>

      <div class="col-span-2 grid grid-cols-5 gap-2 items-center">
        <div class="text-sm truncate col-span-4">
          {{ props.lastMessage }}
        </div>

        <div class="text-xs text-right">
          {{ props.lastMessageAt }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>