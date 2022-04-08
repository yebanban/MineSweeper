<template>
  <div flex="~ gap-3" justify-center pb-8>
    <button @click="toggleDark" btn-logo bg-transparent>
      <div v-if="isDark" i-ph:moon></div>
      <div v-else i-ph:sun></div>
    </button>
    <a href="https://github.com/yebanban/MineSweeper"  title="github" i-mdi-github btn-logo></a>
  </div>
</template>

<script setup lang="ts">
import { useDark } from '../composables/useDark'
const { isDark, toggleDark } = useDark()
</script>

<style lang="scss" scoped></style>
