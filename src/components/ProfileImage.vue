<script setup lang="ts">
import { computed } from 'vue';

interface ProfileImageProps {
  src: string
  size: number
}
const props = defineProps<ProfileImageProps>()
const sizeCss = computed(() => `w-${props.size} h-${props.size}`)
</script>

<template>
  <img 
    :src="props.src"
    alt="profile image"
    class="border border-solid border-outline rounded-full"
    :class="sizeCss"
  />
</template>

<style lang="postcss">

</style>