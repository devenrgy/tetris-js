export default class Tetrads {
  list = [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0],
      [2, 2, 2],
      [2, 0, 0],
    ],
    [
      [0, 0, 0],
      [3, 3, 3],
      [0, 0, 3],
    ],
    [
      [0, 0, 0],
      [4, 4, 0],
      [0, 4, 4],
    ],
    [
      [0, 0, 0],
      [0, 5, 5],
      [5, 5, 0],
    ],
    [
      [0, 0, 0],
      [6, 6, 6],
      [0, 6, 0],
    ],
    [[0, 0, 0, 0],
      [0, 7, 7, 0],
      [0, 7, 7, 0],
      [0, 0, 0, 0],
    ],
  ]

  constructor(rows) {
    this.rows = rows
  }

  getRandomTetra() {
    const randomBlock = JSON.parse(JSON.stringify(this.list[Math.floor(Math.random() * this.list.length)]))
    const posX = Math.floor((this.rows - randomBlock.length) / 2)
    const posY = -1
    return {
      block: randomBlock,
      posX,
      posY,
      ghostPosX: posX,
      ghostPosY: posY,
    }
  }
}
