export interface BlockState {
    x: number
    y: number
    isMine: boolean
    isOpen: boolean
    adjacentMines: number
    isFlag: boolean
}