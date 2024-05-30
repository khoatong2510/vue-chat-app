<script setup lang="ts">
import { defineModel } from 'vue'

const model = defineModel({ required: true })

</script>

<template>
  <input 
    v-model="model"
  />
</template>