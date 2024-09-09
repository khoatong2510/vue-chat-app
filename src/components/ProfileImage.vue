<script setup lang="ts">
interface ProfileImageProps {
  src: string
  size: number
}
const props = defineProps<ProfileImageProps>()
</script>

<template>
  <img 
    :src="props.src"
    alt="profile image"
    class="border border-solid border-green-400 rounded-full"
    :class="`w-${props.size} h-${props.size}`"
  />
</template>

<style lang="postcss">

</style>