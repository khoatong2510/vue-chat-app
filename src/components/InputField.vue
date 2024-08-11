<script setup lang="ts">
import { defineModel } from 'vue'

interface InputFieldProps {
  label?: string
  error?: string | null
  type: 'text' | 'email' | 'password'
  placeholder?: string
}

const props = defineProps<InputFieldProps>()
const model = defineModel({ required: true })
</script>

<template>
  <div>
    <span 
      v-if="props.label"
      class="text-xs text-gray-600"
      :class="props.error ? 'text-red-500' : ''"
    >
      {{ props.label }}
    </span>

    <input
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      class="w-full p-2 mt-1 border border-solid focus:outline-none focus:border-sky-500 focus:shadow-md rounded-md"
      :class="props.error ? 'border-red-500' : 'border-slate-300'"
    />

    <span 
      v-if="props.error" 
      class="text-sm text-red-500"
    >
      {{ props.error }}
    </span>
  </div>
</template>
