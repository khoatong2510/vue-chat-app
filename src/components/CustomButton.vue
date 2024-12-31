<script setup lang="ts">
import { computed } from 'vue';

const emits = defineEmits(['click'])

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
      rounded-2xl
      hover:brightness-75 hover:shadow-sm
      active:brightness-90 active:shadow-none
      transition-colors duration-75 ease-in 
      flex items-center justify-center
    "
    :class="buttonColorCss"
    @click="emits('click')"
  >
    <slot />
  </button>
</template>

<style lang="postcss">

</style>