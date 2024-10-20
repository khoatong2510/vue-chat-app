<script setup lang="ts">
interface MessageProps {
  content: string
  bgColor?: string
}

const props = withDefaults(defineProps<MessageProps>(), {
  bgColor: 'bg-secondaryContainer'
})
</script>

<template>
  <div class="w-fit p-2 leading-tight text-sm rounded-xl hover:bg-neutral-100 cursor-pointer duration-100"
    :class="props.bgColor">
    {{ props.content }}
  </div>
</template>

<style lang="postcss"></style>