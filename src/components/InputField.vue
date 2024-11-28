<script setup lang="ts">
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
      :class="props.error ? 'text-error' : 'text-onSurface'"
    >
      {{ props.label }}
    </span>

    <input
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      class="
        w-full p-2 mt-1 rounded-md text-onSecondaryContainer placeholder:text-onSecondaryContainer placeholder:text-opacity-50
        border border-solid border-outlineVariant bg-surfaceContainerHighest
        focus:outline-none focus:border-outline focus:shadow-sm focus:bg-opacity-80
      "
      :class="props.error ? 'border-error' : 'border-outlineVariant'"
    />

    <span 
      v-if="props.error" 
      class="text-sm text-error"
    >
      {{ props.error }}
    </span>
  </div>
</template>
