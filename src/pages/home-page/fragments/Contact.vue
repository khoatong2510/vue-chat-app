<script setup lang="ts">
import ProfileImage from '@/components/ProfileImage.vue'
import { computed } from 'vue'
import moment from 'moment'

interface ContactProps {
  name: string
  avatarUrl: string
  lastMessage: {
    content: string
    createdAt: Date
  } | null
}
const emits = defineEmits(['click'])
const props = defineProps<ContactProps>()

const isEmpty = computed(() => {
  return props.lastMessage === null
})

const content = computed(() => {
  return props.lastMessage?.content || "Empty conversation"
})

const timeFromNow = computed(() => {
  if (isEmpty)
    return ''

  return moment(props.lastMessage?.createdAt).diff(moment.now(), 'minute') < 1  ? 
    'now' : moment(props.lastMessage?.createdAt).fromNow(true)
})
</script>

<template>
  <div 
    v-bind="$attrs" 
    class="
      flex gap-2 items-start justify-start cursor-pointer
      hover:bg-primaryContainer hover:bg-opacity-50 hover:shadow-md duration-100
      active:bg-secondaryContainer-200 active:bg-opacity-70 active:shadow-none
      rounded-lg p-2
    "
    @click="emits('click')"
    >
    <ProfileImage :src="props.avatarUrl" :size="9" />

    <div class="flex flex-col w-full">
      <div class="font-semibold leading-tight">
        {{ props.name }}
      </div>

      <div class="flex gap-2 items-center justify-between w-full">
        <div 
          class="text-sm truncate flex-1"
          :class="isEmpty ? 'italic' : ''"
        >
          {{ content }}
        </div>

        <div class="text-xs truncate text-right w-14">
          {{ timeFromNow }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>