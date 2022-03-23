<template>
  <div>
    <div v-for="(raw, x) in blocks" :key="x" flex="~" justify-center>
      <button
        v-for="(block, y) in raw"
        :key="y"
        m="1px"
        w-8
        h-8
        border="0.5 gray-400/10"
        cursor-pointer
        bg="gray-500/10 hover:gray-500/20"
      >
        {{ x*10+y }}
      </button>
    </div>
  </div>
  <button>1</button>
</template>

<script setup lang="ts">
interface BlockState {
  isMine: boolean
  isOpen: boolean
  adjacentMines: number
  isFlag: boolean
}
const LENGTH = 10
const WIDTH = 10
const blocks = reactive<BlockState[][]>(
  Array.from({ length: LENGTH }, (_, x) =>
    Array.from({ length: WIDTH }, (_, y) => ({
      isMine: false,
      isOpen: false,
      adjacentMines: x * 10 + y,
      isFlag: false,
    }))
  )
)
</script>

<style lang="scss" scoped>
</style>
