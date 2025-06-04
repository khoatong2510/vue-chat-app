<script setup lang="ts">
import TextEditor from '@/components/TextEditor/TextEditor.vue'

const emits = defineEmits<{
  (e: 'input', value: string): void
}>()

const onInput = (input: string) => {
  console.log('MessageInput onInput', input)
  emits('input', input)
}

</script> 

<template>
  <div 
    class="
      p-3 
      rounded-b-xl
      bg-surfaceContainerHigh
    "
  >
    <TextEditor 
      class="w-full"
      @input="onInput"
    />
  </div>
</template>

<style lang="postcss" scoped>
.emoji {
  display: inline-block;
  background-image: url('emoji-datasource-facebook/img/facebook/sheets/16.png');
  background-size: 1116px 1116px;
  background-repeat: no-repeat;
  background-origin: content-box;
  vertical-align: text-top;
}
</style>