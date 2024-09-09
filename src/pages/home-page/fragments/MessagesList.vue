<script setup lang="ts">
import Message from './Message.vue'

</script>

<template>
  <div class="flex-1 flex flex-col p-4 gap-4">
    <div class="flex gap-2 items-end"> 
      <img 
        src="@/assets/images/785-200x200.jpg"
        class="w-9 h-9 rounded-full"
      />

      <div class="flex flex-col items-start gap-1 w-3/4">
        <Message 
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        
        <Message
          content="Sed ut perspiciatis" 
        />
      </div>
    </div>

    <div class="self-end flex flex-col items-end gap-1 w-3/4">
      <Message 
        content="Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet"
        bg-color="bg-gray-200"
      />

      <Message 
        content="Neque porro quisquam est"
        bg-color="bg-gray-200"
      />
    </div>
  </div>
</template>

<style lang="postcss">

</style>