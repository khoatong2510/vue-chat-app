<script setup lang="ts">
import emojiJson from 'emoji-datasource-facebook/emoji.json'
import { computed, onMounted, useTemplateRef, watch, ref } from 'vue';
import transparentImg from '@/assets/images/transparent.png'

type EmojiAutoCompleteProps = {
  inputText: string,
  contentRange: Range | null
}
const props = defineProps<EmojiAutoCompleteProps>()

const containerRef = useTemplateRef('containerRef')
const ulRef = useTemplateRef('ulRef')

const emits = defineEmits(['shortname-selected', 'close'])

const SHEET_SIZE = 18
const selectIndex = ref<number|null>(null)

const emojiSuggestionsList = computed(() => {
  return emojiJson.filter(emoji => emoji.short_name.includes(props.inputText))  
})

const computedInputText = computed(() => {
  if (selectIndex.value !== null) {
    const selectedElement = ulRef.value?.children[selectIndex.value] as HTMLElement
    return selectedElement.textContent
  }

  return props.inputText
})

const imgStyle = (emoji: any) => {
  return {
    "backgroundPositionX": `calc(-${emoji.sheet_x} * ${SHEET_SIZE}px)`,
    "backgroundPositionY": `calc(-${emoji.sheet_y} * ${SHEET_SIZE}px)`
  }
}

const onSelectShortName = (shortName: string) => {
  emits('shortname-selected', shortName)
}

watch(emojiSuggestionsList, () => {
  if (emojiSuggestionsList.value.length === 0) {
    selectIndex.value = 0
    emits('close')
  }
})

watch(() => props.contentRange, (contentRange: Range|null) => {
  updateContainerPosition(contentRange, containerRef.value)
})

watch(selectIndex, (index) => {
  if (index === null)
    return

  const selectedElement = ulRef.value?.children[index] as HTMLElement
  selectedElement.scrollIntoView({ behavior: "instant", block: "nearest", inline: "start" })
})

onMounted(() => {
  updateContainerPosition(props.contentRange, containerRef.value)
})

const updateContainerPosition = (contentRange: Range|null, containerDiv: HTMLDivElement|null) => {
  if (!contentRange || !containerDiv)
    return

  const boundingRect = contentRange.getBoundingClientRect()
  let xPos = boundingRect.right

  if (boundingRect.right + containerDiv.offsetWidth > document.body.offsetWidth)
    xPos -= (xPos + containerDiv.offsetWidth) - document.body.offsetWidth

  containerDiv.style.left = `${xPos}px`
  containerDiv.style.bottom = `40px`
}

const moveDown = () => {
  if (selectIndex.value === null || selectIndex.value === emojiSuggestionsList.value.length - 1)
    return
  
  selectIndex.value += 1
}

const moveUp = () => {
  if (selectIndex.value === null || selectIndex.value === 0)
    return
  
  selectIndex.value -= 1
}

const onFocus = () => {
  selectIndex.value = 0
}

const onBlur = (event: Event) => {
  if ((event as KeyboardEvent).key === 'ArrowDown' || (event as KeyboardEvent).key === 'ArrowUp')
    return
  
  selectIndex.value = null
  emits('close')
}

const onEnter = () => {
  if (selectIndex.value === null)
    return

  emits('shortname-selected', emojiSuggestionsList.value[selectIndex.value].short_name)
}

</script>

<template>
  <div 
    ref="containerRef"
    class="bg-surface shadow rounded-lg border border-solid border-outlineVariant p-2 w-60 flex flex-col justify-end h-52"
  >
    <ul
      ref="ulRef"
      tabindex="1"
      class="overflow-y-scroll overflow-x-clip h-40 flex flex-col gap-2 snap-y outline-none"
      @focus="onFocus"
      @keydown.down="moveDown"
      @keydown.up="moveUp"
      @keydown.enter.prevent="onEnter"
      @keydown="onBlur"
    >
      <li 
        v-for="(emoji, index) in emojiSuggestionsList"
        :key="`${emoji.name}-${index}`"
        class="flex items-center gap-1 cursor-pointer hover:bg-surfaceDim p-1 snap-start"
        :class="selectIndex === index ? 'bg-surfaceContainerHigh' : ''"
        @click="onSelectShortName(emoji.short_name)"
      >
        <img 
          :src="transparentImg" 
          class="emoji" 
          :style="imgStyle(emoji)"
        >
        
        <span class="text-sm">
          {{ emoji.short_name }}
        </span>
      </li>
    </ul>

    <div>:{{ computedInputText }}</div>
  </div>
</template>

<style lang="postcss">
.emoji {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url('emoji-datasource-facebook/img/facebook/sheets/16.png');
  background-size: 1116px 1116px;
  background-repeat: no-repeat;
  background-origin: content-box;
  vertical-align: middle;
}

</style>