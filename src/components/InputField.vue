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
      class="text-xs"
      :class="props.error ? 'text-error' : ''"
    >
      {{ props.label }}
    </span>

    <input
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      class="
        w-full p-2 mt-1 rounded-md
        border border-solid border-outlineVariant bg-tertiaryContainer bg-opacity-50
        focus:outline-none focus:border-outline focus:shadow-md focus:bg-opacity-75
      "
      :class="props.error ? 'border-error' : 'border-outline'"
    />

    <span 
      v-if="props.error" 
      class="text-sm text-error"
    >
      {{ props.error }}
    </span>
  </div>
</template>
