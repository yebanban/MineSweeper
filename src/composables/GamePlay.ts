import type { BlockState } from '../../types/BlockState'
import type { Ref } from 'vue'
type GameStatus = 'ready' | 'play' | 'won' | 'lost'
interface GameState {
  blocks: BlockState[][]
  isGeneration: boolean
  status: GameStatus
  time: number
  flagCount:number
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
export class GamePlay {
  gameState = ref() as Ref<GameState>
  startTimer:()=>void=null as unknown as ()=>void
  stopTimer:()=>void=null as unknown as ()=>void

  constructor(private length: number, private width: number, private mines: number) {
    this.reset()
  }
  get remainMines(){
      return this.mines-this.gameState.value.flagCount
  }
  get blocks() {
    return this.gameState.value.blocks
  }
  getToggleTimer() {
    let timer: number
    return {
        startTimer:()=>{
            timer = setInterval(() => {
                this.gameState.value.time++
              }, 1000)
        },stopTimer:()=>{
            clearInterval(timer)
        }
    }
  }
  reset(length = this.length, width = this.width, mines = this.mines) {
    this.length = length
    this.width = width
    this.mines = mines
    if(this.stopTimer) this.stopTimer()
    let toggleTimer=this.getToggleTimer()
    this.startTimer=toggleTimer.startTimer
    this.stopTimer=toggleTimer.stopTimer
    this.gameState.value = {
      isGeneration: false,
      status: 'ready',
      time: 0,
      flagCount:0,
      blocks: reactive<BlockState[][]>(
        Array.from({ length: this.length }, (_, x) =>
          Array.from({ length: this.width }, (_, y) => ({
            x,
            y,
            isMine: false,
            isOpen: false,
            adjacentMines: 0,
            isFlag: false,
          }))
        )
      ),
    }
  }

  generateMines(init: BlockState) {
    for (let i = 0; i < this.mines; i++) {
      do {
        var x = Math.floor(Math.random() * this.length)
        var y = Math.floor(Math.random() * this.width)
      } while ((Math.abs(x - init.x) <= 1 && Math.abs(y - init.y) <= 1) || this.blocks[x][y].isMine)
      this.blocks[x][y].isMine = true
    }
  }
  getAllRound(block: BlockState) {
    return dir
      .map(d => {
        let x = block.x + d[0],
          y = block.y + d[1]
        if (x < 0 || x >= this.length || y < 0 || y >= this.width) return undefined
        return this.blocks[x][y]
      })
      .filter(Boolean) as BlockState[]
  }
  generateAdjacentMines() {
    this.blocks.forEach(raw =>
      raw.forEach(block => {
        if (block.isMine) return
        this.getAllRound(block).forEach(b => {
          b.isMine && block.adjacentMines++
        })
      })
    )
  }
  lclick(block: BlockState) {
    if (this.gameState.value.status === 'won' || this.gameState.value.status === 'lost') return
    if (block.isFlag) return
    if (!this.gameState.value.isGeneration) {
        this.gameStart(block)
    }
    if (block.isOpen) {
      this.openAround(block)
    } else {
      this.open(block)
    }
    if (this.isWin()) {
      this.gameOver('won')
      alert('赢了！')
    }
  }
  rclick (block: BlockState){
    if (this.gameState.value.status !== 'play' || block.isOpen) return
    this.setFlag(block)
    if (this.isWin()) {
      this.gameOver('won')
      alert('赢了！')
    }
  }
  gameStart(block: BlockState){
    this.generateMines(block)
    this.generateAdjacentMines()
    this.gameState.value.isGeneration = true
    this.gameState.value.status = 'play'
    this.startTimer()
  }
  open(block: BlockState){
    block.isOpen = true
    this.expendZero(block)
    if (block.isMine) {
      this.showAllMines()
      this.gameOver('lost')
      setTimeout(() => {
        alert('失败！')
      })
    }
  }
  openAround(block: BlockState){
    let allRound = this.getAllRound(block)
    let flagSum = 0
    allRound.forEach(b => {
      if (b.isFlag) flagSum++
    })
    if (flagSum >= block.adjacentMines) {
      allRound.forEach(b => {
        if (!b.isOpen && !b.isFlag) this.open(b)
      })
    }
  }
  isWin(){
    return this.blocks.flat().every(b => b.isOpen || (b.isFlag && b.isMine))
  }
  setFlag(block: BlockState){
    block.isFlag = !block.isFlag
    if(block.isFlag){
        this.gameState.value.flagCount++
    }else{
        this.gameState.value.flagCount--
    }
  }
  gameOver(status: GameStatus) {
    this.gameState.value.status = status
    this.stopTimer()
  }
  showAllMines(){
    this.blocks.flat().forEach(b => {
      if (b.isMine && !b.isFlag) {
        b.isOpen = true
      }
    })
  }
  expendZero(block: BlockState){
    if (block.isMine || block.adjacentMines !== 0) return
    this.getAllRound(block).forEach(b => {
      if (!b.isOpen && !b.isFlag) {
        this.open(b)
      }
    })
  }
}
