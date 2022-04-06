<template>
  <button
    m="1px"
    w-8
    h-8
    border="0.5 gray-400/10"
    cursor-pointer
    :class="getClass(block)"
    font-700
    flex
    items-center
    justify-center
  >
    <template v-if="block.isOpen">
      <div v-if="block.isMine" i-mdi:mine></div>
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
    <template v-else-if="block.isFlag">
      <div i-mdi:flag text-red></div>
    </template>
  </button>
</template>

<script setup lang="ts">
import type { BlockState } from '../../types/BlockState';
defineProps<{block:BlockState}>()

const colorByMines = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]
const getClass = (block: BlockState) => {
  if (block.isOpen) {
    return block.isMine ? 'bg-red-500/50' : colorByMines[block.adjacentMines] + ' bg-transparent'
  } else {
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  }
}
</script>

<style lang="scss" scoped></style>
