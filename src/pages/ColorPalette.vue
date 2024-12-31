<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col gap-4 p-8 bg-background">
    <div class="text-xl">Primary</div>
    <div class="flex gap-4">
      <div class="bg-primary flex items-end rounded-2xl shadow p-4">
        <span class="text-onPrimary">Primary</span>
      </div>

      <div class="bg-primaryContainer flex items-end rounded-2xl shadow p-4">
        <span class="text-onPrimaryContainer">Primary Container</span>
      </div>
    </div>

    <div class="text-xl">Secondary</div>

    <div class="flex gap-4">
      <div class="bg-secondary flex items-end rounded-2xl shadow p-4">
        <span class="text-onSecondary">Secondary</span>
      </div>

      <div class="bg-secondaryContainer flex items-end rounded-2xl shadow p-4">
        <span class="text-onSecondaryContainer">Secondary Container</span>
      </div>
    </div>

    <div class="text-xl">tertiary</div>

    <div class="flex gap-4">
      <div class="bg-tertiary flex items-end rounded-2xl shadow p-4">
        <span class="text-onTertiary">Tertiary</span>
      </div>

      <div class="bg-tertiaryContainer flex items-end rounded-2xl shadow p-4">
        <span class="text-onTertiaryContainer">Tertiary Container</span>
      </div>
    </div>

    <div class="text-xl">Error</div>

    <div class="flex gap-4">
      <div class="bg-error flex justify-center items-center rounded-2xl shadow p-4 min-w-40">
        <span class="text-onError">Error</span>
      </div>
    </div>

    <div class="bg-background w-20 h-20" />
    <div class="bg-onBackground w-20 h-20" />
    <div class="bg-surface w-20 h-20" />
    <div class="bg-onSurface w-20 h-20" />
    <div class="bg-outline w-20 h-20" />
    <div class="bg-outlineVariant w-20 h-20" />
    <div class="bg-shadow w-20 h-20" />
    <div class="bg-scrim w-20 h-20" />
  </div>

</template>