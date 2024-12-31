<script setup lang="ts">
import { useUserProfileStore } from '@/stores/profile';
import type { ID } from '@/types';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

interface MessageProps {
  sentBy: ID
  content: string
  bgColor?: string
}

const props = withDefaults(defineProps<MessageProps>(), {
  bgColor: 'bg-secondaryContainer'
})

const userProfileStore = useUserProfileStore()
const { userProfile } = storeToRefs(userProfileStore)

const cssClass = computed(() => {
  if (!userProfile.value)
    return ''

  if (props.sentBy === userProfile.value.id)
    return 'bg-tertiaryFixed text-neutral-100 self-end'
  
  return 'bg-secondaryFixed text-neutral-900 self-start'
})
</script>

<template>
  <div class="w-fit p-2 leading-tight text-sm rounded-xl hover:bg-neutral-100 cursor-pointer duration-100"
    :class="cssClass">
    {{ props.content }}
  </div>
</template>

<style lang="postcss"></style>