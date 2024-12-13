<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { FaceSmileIcon } from '@heroicons/vue/24/outline'
import emojiJson from 'emoji-datasource-facebook'
import EmojiPicker from 'vue3-emoji-picker'

const inputRef = useTemplateRef('inputRef')

const inputText = defineModel<string>({ default: '', required: true })
const showEmojiPicker = ref<boolean>(false)

const sheetSize = 64

const emits = defineEmits<{
  (e: 'submit', value: string): void
}>()

// const renderText = computed(() => {
//   return emojiConvertor.replace_colons(inputText.value)
// })

const onSelectEmoji = (emoji: any) => {
  inputText.value += String.fromCodePoint(parseInt(emoji.r, 16))
}

onMounted(() => {
  // console.log("emojiJson", emojiJson[0])
  const res = emojiJson.find(emoji => emoji.short_name === 'grin')
})

const onUpdateHeight = (event: Event) => {
  const element = (event.target as HTMLElement)
  element.style.height = "1px"
  element.style.height = `${element.scrollHeight + 2}px`
}

const onSubmit = () => {
  emits('submit', inputText.value)
}

const onInput = (event: Event) => {
  const element = inputRef.value as HTMLDivElement

  // i dont want innerText
  const content = transform(element)
  inputText.value = content
  const regex = /\:\w+/g
  const found = content.match(regex)

  if (found) {
    // add span tag
    const emojiName = found[found.length - 1].slice(1)
    console.log("emojiName", emojiName)

    const emoji = emojiJson.find(e => e.short_name === emojiName)

    if (emoji) {
      const span = document.createElement('img')
      span.setAttribute("em-data", emojiName)
      span.classList.add('emoji')
      span.style.display = 'inline-block'
      span.style.backgroundPositionX = `calc(${emoji.sheet_x} * 18px)`
      span.style.backgroundPositionY = `calc(${emoji.sheet_y} * 18px)`

      element.appendChild(span)
    }
  }
}

const transform = (element: HTMLDivElement): string => {
  let content = ''
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      content += child.nodeValue
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      content += (child as Element).getAttribute("em-data")
    } else 
      throw Error("Invalid doc node")
  }

  return content
}

watch(inputText, () => {
  console.log("inputText", inputText)
})

</script> 

<template>
  <div 
    class="
      flex items-center gap-2 p-4 
      border border-solid border-outlineVariant 
      rounded-b-xl
      bg-surfaceContainerHigh
    "
  >
    <div 
      ref="inputRef"
      contenteditable="true"
      class="min-h-10 max-h-16 w-full p-3 border border-solid border-outlineVariant rounded-xl outline-none text-sm bg-surfaceContainerLowest bg-opacity-50" 
      @input="onInput"
      @keydown.delete="onUpdateHeight"
      @keydown.enter.exact.prevent="onSubmit"
      @keydown.shift.enter.exact="onUpdateHeight"
    >
    </div>
    
    <!-- <textarea
      ref="textareaRef"
      v-model="inputText"
      @keydown.delete="onUpdateHeight"
      @keydown.enter.exact.prevent="onSubmit"
      @keydown.shift.enter.exact="onUpdateHeight"
      class="min-h-10 max-h-16 w-full p-3 border border-solid border-outlineVariant rounded-xl outline-none text-sm bg-surfaceContainerLowest bg-opacity-50" 
    /> -->
    <!-- <span class="emoji"></span> -->

    <div>
      <EmojiPicker 
        v-if="showEmojiPicker"
        :hide-group-names="true"
        :hide-group-icons="true"
        :hide-search="true"
        :disable-skin-tones="true"
        class="absolute right-8 bottom-20"
        @select="onSelectEmoji"
      />

      <FaceSmileIcon 
        class="w-7 h-7 text-onPrimaryContainer hover:text-onPrimaryFixed duration-100 cursor-pointer"
        @click="showEmojiPicker = !showEmojiPicker"
      />
    </div>
  </div>
</template>

<style lang="postcss">
textarea {
  resize: none;
}

.emoji {
  width: 16px;
  height: 16px;
  background-image: url('emoji-datasource-facebook/img/facebook/sheets/16.png');
  background-size: auto;
  background-repeat: none;
  line-height: normal;
}
</style>