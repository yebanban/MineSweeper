<template>
  <div pt-10 text='center '>
    MineSweeper
    <div mt-8 flex="~ gap-6" justify-center>
      <button btn @click="gamePlay.reset()">New Game</button>
      <button btn @click="newGame('easy')">Easy</button>
      <button btn @click="newGame('medium')">Medium</button>
      <button btn @click="newGame('hard')">Hard</button>
    </div>
    <div mt-8 flex="~ gap-6" justify-center font-mono>
      <div flex="~ gap-1" items-center text-2xl>
        <div i-ph:timer></div>
        {{ gamePlay.gameState.value.time }}
      </div>
      <div flex="~ gap-1" items-center text-2xl>
        <div i-mdi:mine></div>
        {{ gamePlay.remainMines }}
      </div>
    </div>
    <div p-10>
      <div v-for="(raw, x) in gamePlay.blocks" :key="x" flex="~" justify-center>
        <block
          v-for="(block, y) in raw"
          :key="y"
          :block="block"
          @click="gamePlay.lclick(block)"
          @contextmenu.prevent="gamePlay.rclick(block)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GamePlay } from '../composables/GamePlay'
const gamePlay = new GamePlay(10, 10, 16)
const newGame=(difficult:'easy'|'medium'|'hard')=>{
  switch(difficult){
    case 'easy':
      gamePlay.reset(10,10,16)
      break
    case 'medium':
      gamePlay.reset(16,16,60)
      break  
    case 'hard':
      gamePlay.reset(22,22,99)
      break  
  }
  
}
</script>

<style lang="scss" scoped></style>
