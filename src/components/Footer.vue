<template>
  <div flex justify-center pb-8>
    <button @click="toggleDark" cursor-pointer bg-transparent border-0 text-xl>
      <div v-if="isDark" i-ph:moon text-white></div>
      <div v-else i-ph:sun></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDark } from '../composables/useDark'
const { isDark, toggleDark } = useDark()
</script>

<style lang="scss" scoped></style>
