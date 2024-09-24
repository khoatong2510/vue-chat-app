<script setup lang="ts">
import { computed } from 'vue';


type ButtonProps = {
  type: 'primary'|'secondary'|'tertiary'
}

const { type = 'primary' } = defineProps<ButtonProps>()

const buttonColorCss = computed(() => {
  if (type === 'primary')
    return 'bg-primaryContainer text-onPrimaryContainer'
  else if (type === 'secondary')
    return 'bg-secondaryContainer text-onSecondaryContainer'
  else 
    return 'bg-tertiaryContainer text-onTertiaryContainer'
})
</script>

<template>
  <button 
    class="
      w-full rounded-2xl py-2
      min-h-10
      shadow-sm
      hover:opacity-80 hover:shadow-md
      active:opacity-90  active:shadow-none
      transition-colors duration-75 ease-in 
      flex items-center justify-center
    "
    :class="buttonColorCss"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style lang="postcss">

</style>