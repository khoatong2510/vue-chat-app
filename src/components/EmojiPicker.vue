<script setup lang="ts">
import { onMounted } from 'vue'
import emojiDataSource from 'emoji-datasource-facebook'
import emojiSheet from 'emoji-datasource-facebook/img/facebook/sheets/64.png'

onMounted(() => {
  console.log("emoji datasource", emojiDataSource)
})

</script>

<template>
<div>
  This is an emoji picker
  <div 
    v-for="emoji in emojiDataSource"
    :key="emoji.name"
  >
    <div>{{ emoji.name }}</div>
    <div>{{ emoji.unified }}</div>
    <div>x: {{ emoji.sheet_x }}, y: {{ emoji.sheet_y }}</div>

  </div>
</div>
</template>

<style lang="postcss">

</style>