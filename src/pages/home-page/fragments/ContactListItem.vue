<script setup lang="ts">
import ProfileImage from '@/components/ProfileImage.vue'
import { computed } from 'vue'
import moment from 'moment'

interface ContactProps {
  members: {
    id: string
    name: string
    avatarUrl: string
  }[]
  lastMessage: {
    content: string
    createdAt: Date
  } | null
  isActive: boolean
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
  if (isEmpty.value)
    return ''

  return moment(props.lastMessage?.createdAt).diff(moment.now(), 'minute') < 1  ? 
    'now' : moment(props.lastMessage?.createdAt).fromNow(true)
})

const avatarUrl = computed(() => {
  return props.members[0].avatarUrl
})

const name = computed(() => {
  return props.members[0].name
})
</script>

<template>
  <div 
    v-bind="$attrs" 
    class="
      flex gap-2 items-start justify-start cursor-pointer
      hover:bg-primaryContainer duration-100
      active:bg-primaryFixedDim active:bg-opacity-70
      p-2 border-y border-y-solid border-y-outlineVariant
    "
    :class="isActive ? 'bg-primaryContainer' : ''"
    @click="emits('click')"
    >
    <ProfileImage :src="avatarUrl" :size="10" />

    <div class="flex flex-col w-full">
      <div class="font-semibold leading-tight">
        {{ name }}
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