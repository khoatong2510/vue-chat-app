<script setup lang="ts">
import { ref } from 'vue'
import { FaceSmileIcon } from '@heroicons/vue/24/outline'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const showEmojiPicker = ref<boolean>(false)

const onSelectEmoji = (emoji: object) => {
  console.log(emoji)
}
</script>

<template>
  <div class="flex-none flex items-center gap-2 p-4 border-t border-solid border-blue-300 bg-blue-400 bg-opacity-50">
    <textarea
      :rows="5"
      class="h-9 w-full p-2 border border-solid border-orange-400 rounded-xl outline-none text-xs bg-orange-50 bg-opacity-50" 
    />

    <div>
      <EmojiPicker 
        v-if="showEmojiPicker"
        :native="true" 
        class="absolute right-8 bottom-20"
        @select="onSelectEmoji"
      />

      <FaceSmileIcon 
        class="w-7 h-7 text-orange-600 hover:text-orange-700 duration-100 cursor-pointer"
        @click="showEmojiPicker = !showEmojiPicker"
      />
    </div>
  </div>
</template>

<style lang="postcss">

</style>