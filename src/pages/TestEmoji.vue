<script setup lang="ts">
// import img16 from 'emoji-datasource-facebook/img/facebook/sheets/16.png'
import img64 from 'emoji-datasource-facebook/img/facebook/sheets/64.png'
import { onMounted, ref, useTemplateRef, watch } from 'vue'

const spanRef = useTemplateRef("spanRef")
const x = ref<number>(0)
const y = ref<number>(0)

const onDecreaseX = () => {
  if (x.value === 0)
    return

  x.value -= 1
}

const onIncreaseX = () => {
  x.value += 1
}

const onDecreaseY = () => {
  if (y.value === 0)
    return

  y.value -= 1
}

const onIncreaseY = () => {
  y.value += 1
}

const updateSpan = () => {
  const span = spanRef.value as HTMLSpanElement
  span.style.backgroundPositionX = `calc(-${x.value} * 66px - 1px)`
  span.style.backgroundPositionY = `calc(-${y.value} * 66px - 1px)`
}

watch(x, () => {
  updateSpan()
})

watch(y, () => {
  updateSpan()
})

</script>

<template>
  <div class="overflow-y-clip">
    <div>
      <div 
        tabindex="0"
        @keydown.stop.prevent.up="onDecreaseY"
        @keydown.stop.prevent.down="onIncreaseY"
        @keydown.stop.prevent.left="onDecreaseX"
        @keydown.stop.prevent.right="onIncreaseX"
      >
        <p>width: {{ x }}</p>
        
        <p>height {{ y }}</p>
      </div>
      <img
        ref="spanRef" 
        class="emoji"
        width="66px"
        height="66px"
      >
    </div>
    <img :src="img64" width="4092" height="4092" />
  </div>
</template>

<style lang="postcss" scoped>

.emoji {
  width: 66px;
  height: 66px;
  display: inline-block;
  background-image: url('emoji-datasource-facebook/img/facebook/sheets/64.png');
  background-size: 4092px 4092px;
  background-repeat: no-repeat;
  background-origin: content-box;
  line-height: normal;
}

</style>