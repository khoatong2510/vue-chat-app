<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';

type ChatHeaderProps = {
  name: string
  avatarUrl: string
  activeTime: Date
}

const props = defineProps<ChatHeaderProps>()

const activeTimeString = computed(() => moment(props.activeTime).fromNow())
</script>

<template>
  <div class="
    flex p-4 justify-start items-start gap-2 
    cursor-pointer 
    border-b border-solid border-outlineVariant bg-primaryContainer drop-shadow-sm rounded-t-xl
    hover:bg-opacity-80 hover:drop-shadow duration-100"
  >
    <img 
      :src="props.avatarUrl" 
      class="w-10 h-10 rounded-full border-2 border-solid border-outline"
    >

    <div class="flex flex-col items-start justify-start ">
      <div class="text-lg font-semibold text-onPrimaryFixed">
        {{ props.name }}
      </div>
      
      <div class="text-sm text-onPrimaryFixedVariant">
        Active {{ activeTimeString }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss">

</style>