<template>
  <div p-10>
    <div v-for="(raw, x) in blocks" :key="x" flex="~" justify-center>
      <button
        v-for="(block, y) in raw"
        :key="y"
        m="1px"
        w-8
        h-8
        border="0.5 gray-400/10"
        cursor-pointer
        :class="getClass(block)"
        @click="lclick(block)"
        @contextmenu.prevent="setFlag(block)"
        font-700
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
    </div>
  </div>
</template>

<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  isMine: boolean
  isOpen: boolean
  adjacentMines: number
  isFlag: boolean
}
const LENGTH = 10
const WIDTH = 10
const isGeneration = ref(false)
const isEnd = ref(false)
const blocks = reactive<BlockState[][]>(
  Array.from({ length: LENGTH }, (_, x) =>
    Array.from({ length: WIDTH }, (_, y) => ({
      x,
      y,
      isMine: false,
      isOpen: false,
      adjacentMines: 0,
      isFlag: false,
    }))
  )
)
const getClass = (block: BlockState) => {
  if (block.isOpen) {
    return block.isMine ? 'bg-red-500/50' : colorByMines[block.adjacentMines] + ' bg-transparent'
  } else {
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  }
}
const generateMines = (rate: number, init: BlockState) => {
  blocks.forEach(raw =>
    raw.forEach(block => {
      if (Math.abs(block.x - init.x) <= 1 && Math.abs(block.y - init.y) <= 1) return
      if (Math.random() < rate) block.isMine = true
    })
  )
}
const lclick = (block: BlockState) => {
  if (isEnd.value) return
  if (block.isFlag) return
  if (!isGeneration.value) {
    generateMines(0.2, block)
    generateAdjacentMines()
    isGeneration.value = true
  }
  if (block.isOpen) {
    openAround(block)
  } else {
    open(block)
  }
}
const open = async (block: BlockState) => {
  block.isOpen = true
  expendZero(block)

  await nextTick()
  if (block.isMine) {
    showAllMines()
    gameOver()
    alert('失败！')
  } else if (isWin()) {
    gameOver()
    alert('赢了！')
  }
}
const openAround = (block: BlockState) => {
  let allRound = getAllRound(block)
  let flagSum = 0
  allRound.forEach(b => {
    if (b.isFlag) flagSum++
  })
  if (flagSum >= block.adjacentMines) {
    allRound.forEach(b => {
      if (!b.isOpen && !b.isFlag) open(b)
    })
  }
}
const isWin = () => {
  return blocks.flat().every(b => b.isOpen || (b.isFlag && b.isMine))
}
const setFlag = async (block: BlockState) => {
  if (isEnd.value || block.isOpen) return
  block.isFlag = !block.isFlag
  await nextTick()
  if (isWin()) {
    gameOver()
    alert('赢了！')
    
  }
}
const gameOver = () => {
  isEnd.value = true
}
const showAllMines = () => {
  blocks.flat().forEach(b => {
    if (b.isMine) {
      b.isOpen = true
    }
  })
}
const dir = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]
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
const getAllRound = (block: BlockState) => {
  return dir
    .map(d => {
      let x = block.x + d[0],
        y = block.y + d[1]
      if (x < 0 || x >= LENGTH || y < 0 || y >= WIDTH) return undefined
      return blocks[x][y]
    })
    .filter(Boolean) as BlockState[]
}
const generateAdjacentMines = () => {
  blocks.forEach(raw =>
    raw.forEach(block => {
      if (block.isMine) return
      getAllRound(block).forEach(b => {
        b.isMine && block.adjacentMines++
      })
    })
  )
}
const expendZero = (block: BlockState) => {
  if (!block.isMine && block.adjacentMines === 0) {
    getAllRound(block).forEach(b => {
      if (!b.isOpen && !b.isFlag) {
        b.isOpen = true
        expendZero(b)
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
