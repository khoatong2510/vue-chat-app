<script setup lang="ts">
import { useUserProfileStore } from '@/stores/profile';
import type { ID } from '@/types';
import { storeToRefs } from 'pinia';
import { computed, onMounted, useTemplateRef } from 'vue';
import emojiJson from 'emoji-datasource-facebook/emoji.json'
import transparentImg from '@/assets/images/transparent.png'
const SHEET_SIZE = 18

interface MessageProps {
  sentBy: ID
  content: string
  bgColor?: string
}

const props = withDefaults(defineProps<MessageProps>(), {
  bgColor: 'bg-secondaryContainer'
})

const messageCard = useTemplateRef<HTMLDivElement>('messageCard')
const userProfileStore = useUserProfileStore()
const { userProfile } = storeToRefs(userProfileStore)

const cssClass = computed(() => {
  if (!userProfile.value)
    return ''

  if (props.sentBy === userProfile.value.id)
    return 'bg-tertiaryFixed text-neutral-100 self-end'
  
  return 'bg-secondaryFixed text-neutral-900 self-start'
})

onMounted(() => {
  if (!messageCard.value) return ''

  const res = props.content.replace(/<em>([^<]+)<\/em>/g, (match, emojiName) => {
    const emoji = emojiJson.find(e => e.short_name === emojiName)
    if (!emoji) return match

    return `<img 
      src="${transparentImg}"
      class="emoji"
      style="
        width: ${SHEET_SIZE}px;
        height: ${SHEET_SIZE}px;
        background-position-x: calc(-${emoji.sheet_x} * ${SHEET_SIZE}px);
        background-position-y: calc(-${emoji.sheet_y} * ${SHEET_SIZE}px);
      "
      alt="${emoji.short_name}"
    />`
  })

  messageCard.value.innerHTML = res
})

</script>

<template>
  <div 
    ref="messageCard"
    class="w-fit p-2 leading-tight text-sm rounded-xl hover:bg-neutral-100 cursor-pointer duration-100 whitespace-pre-wrap"
    :class="cssClass">
  </div>
</template>

<style lang="postcss"></style>