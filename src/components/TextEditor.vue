<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import { FaceSmileIcon } from '@heroicons/vue/24/outline'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

import EmojiAutoComplete from './EmojiAutoComplete.vue'
import emojiJson from 'emoji-datasource-facebook/emoji.json'
import transparentImg from '@/assets/images/transparent.png'

const emits = defineEmits(['input'])
const SHEET_SIZE = 18
const inputRef = useTemplateRef('inputRef')
const emojiAutoCompleteRef = useTemplateRef('emojiAutoCompleteRef')

const showEmojiAutoComplete = ref<boolean>(false)
const showEmojiPicker = ref<boolean>(false)
const emojiInput = ref<string>('')
const contentRange = ref<Range|null>(null)

let savedCaretPosition = reactive<Pick<Selection, 'anchorNode'|'anchorOffset'>>({
  anchorNode: null,
  anchorOffset: -1
})

const onInput = (event: Event) => {
  if ((event as InputEvent).data === ':') {
    const selection = window.getSelection()
    savedCaretPosition = {
      anchorNode: selection?.anchorNode || null,
      anchorOffset: selection?.anchorOffset || -1
    }

    showEmojiAutoComplete.value = true
  }
  
  if ((savedCaretPosition.anchorNode?.nodeValue?.length ?? -1) < savedCaretPosition.anchorOffset) {
    resetEmojiAutoComplete()
  }

  if (showEmojiAutoComplete.value) {
    const selection = window.getSelection()
    contentRange.value = getContentRange(selection)
    emojiInput.value = getEmojiInput(selection)
  }
}

onMounted(() => {
  inputRef.value?.focus()
})

watch(showEmojiAutoComplete, () => {
  if (!showEmojiAutoComplete.value)
    return

  const selection = window.getSelection()
  contentRange.value = getContentRange(selection)
  emojiInput.value = getEmojiInput(selection)
})

const getEmojiInput = (selection: Selection | null): string => {
  const { anchorNode, anchorOffset } = savedCaretPosition
  
  if (!selection || !selection.anchorNode || !anchorNode || anchorOffset < 0)
    return ''
  
  let range = new Range()
  range.setStart(anchorNode, anchorOffset)
  range.setEnd(selection.anchorNode, selection.anchorOffset)
  return range.toString()
}

const getContentRange = (selection: Selection | null): Range|null => {
  let range = new Range()
  const firstChild = inputRef.value?.firstChild

  if (!firstChild || !selection)
    return null

  const currentCaretRange = selection.getRangeAt(0)
  range.setStart(firstChild, 0)
  range.setEnd(currentCaretRange.endContainer, currentCaretRange.endOffset)

  return range
}

const onDelete = () => {
  onUpdateHeight()
  resetEmojiAutoComplete()
}

const onAddNewLine = () => {
  let selection = window.getSelection()

  if (!selection)
    return

  const range = selection.getRangeAt(0)

  const brNode = document.createElement('br')
  const secondBrNode = brNode.cloneNode()
  range.insertNode(brNode)
  range.insertNode(secondBrNode)
  range.setStartAfter(secondBrNode)
  range.collapse(true)
  
  selection.removeAllRanges()
  selection.addRange(range)

  onUpdateHeight()
}

const onUpdateHeight = () => {
  const input = inputRef.value
  if (!input)
    return

  input.style.height = `1px`
  input.style.height = `${input.scrollHeight}px`
}

const onSubmit = () => {
  // convert the content to string
  if (!inputRef.value)
    return

  // clone inputRef.value
  const cloneInput = inputRef.value.cloneNode(true) as HTMLElement

  //
  for (const node of cloneInput.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'IMG') {
      const img = node as HTMLImageElement
      const shortName = img.getAttribute('em-data')
      if (shortName) {
        const textNode = document.createTextNode(`<em>${shortName}</em>`)
        cloneInput.replaceChild(textNode, img)
      }
    }
    else if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
      const textNode = document.createTextNode('\n')
      cloneInput.replaceChild(textNode, node)
    }
  }

  inputRef.value.innerHTML = ''
  emits('input', cloneInput.innerText)
}

const onSelectEmoji = (emoji: any) => {
  const selectedEmoji = emojiJson.find(e => emoji.n.includes(e.short_name))
  
  if (!selectedEmoji)
    return

  insertEmojiImageToCarePosition(selectedEmoji)
}

const resetEmojiAutoComplete = () => {
  showEmojiAutoComplete.value = false
  
  savedCaretPosition = {
    anchorNode: null, 
    anchorOffset: -1
  }

  emojiInput.value = ''
}

const autoCompleteFocus = () => {
  if (showEmojiAutoComplete.value)
    (emojiAutoCompleteRef.value?.$el.firstChild as HTMLElement).focus()
}

const onShortnameSelected = (shortName: string) => {
  const emoji = emojiJson.find(e => e.short_name === shortName)
  
  const selection = window.getSelection()

  if (savedCaretPosition.anchorNode === null || !selection || selection.anchorNode === null || inputRef.value === null) 
    return

  // remove the shortname
  const range = new Range()
  range.setStart(savedCaretPosition.anchorNode, savedCaretPosition.anchorOffset - 1)
  range.setEnd(selection.anchorNode, selection.anchorOffset)
  range.deleteContents()

  insertEmojiImageToCarePosition(emoji)

  resetEmojiAutoComplete()
}

const insertEmojiImageToCarePosition = (emoji?: any) => {
  if (!emoji)
    return

  let selection = window.getSelection()
  if (!selection || !selection.anchorNode)
    return
  
  const range = new Range()
  range.setStart(selection.anchorNode , selection.anchorOffset)

  const img = document.createElement('img')

  img.setAttribute("em-data", emoji.short_name)
  img.setAttribute("src", transparentImg)
  img.classList.add('emoji')
  img.style.width = `${SHEET_SIZE}px`
  img.style.height = `${SHEET_SIZE}px`
  img.style.backgroundPositionX = `calc(-${emoji.sheet_x} * ${SHEET_SIZE}px)`
  img.style.backgroundPositionY = `calc(-${emoji.sheet_y} * ${SHEET_SIZE}px)`

  range.insertNode(img)
  const newRange = new Range()
  newRange.setStartAfter(img)
  newRange.collapse(true)
  
  selection.removeAllRanges()
  selection.addRange(newRange)
}

</script>

<template>
  <div class="relative flex items-center gap-2">
    <div 
      tabindex="0"
      ref="inputRef"
      contenteditable="true"
      class="
        block
        min-h-10 max-h-16 w-full px-3 py-2 
        border border-solid border-outlineVariant 
        rounded-xl outline-none 
        text-sm 
        bg-surfaceContainerLowest bg-opacity-50 
        overflow-y-auto
        whitespace-pre-wrap
      " 
      @input="onInput"
      @click="resetEmojiAutoComplete"
      @keydown.up="resetEmojiAutoComplete"
      @keydown.down="autoCompleteFocus"
      @keydown.left="resetEmojiAutoComplete"
      @keydown.right="resetEmojiAutoComplete"
      @keydown.delete="onDelete"
      @keydown.enter.exact.prevent="onSubmit"
      @keydown.shift.enter.exact.prevent="onAddNewLine"
    >
    </div>

    <EmojiAutoComplete
      v-if="showEmojiAutoComplete && contentRange"
      ref="emojiAutoCompleteRef" 
      class="absolute"
      :input-text="emojiInput"
      :content-range="contentRange"
      @shortname-selected="onShortnameSelected"
      @close="resetEmojiAutoComplete"
    />

    <div>
      <EmojiPicker 
        v-if="showEmojiPicker"
        :hide-group-names="true"
        :hide-group-icons="true"
        :hide-search="true"
        :disable-skin-tones="true"
        class="absolute right-0 bottom-16"
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
br {
  display: block;
  width: 1px;
}
</style>