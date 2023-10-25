import Tetrads from './Tetrads.js'
import Preview from './Preview.js'

export default class Game {
  isGameOver = false
  scores = [800, 1200, 1800, 2000]
  overlay = document.querySelector('.overlay')
  gameoverPopup = document.querySelector('.gameover')
  isMute = false

  constructor(playfield) {
    this.cols = getComputedStyle(playfield).getPropertyValue('grid-template-rows').split(' ').length
    this.rows = getComputedStyle(playfield).getPropertyValue('grid-template-columns').split(' ').length
    this.newGame()
  }

  get score() {
    return this._score
  }

  set score(points) {
    this._score += points
  }

  get playfield() {
    const copyPlayfield = JSON.parse(JSON.stringify(this._playfield))

    this.calculateGhostPosition()
    this.tetraLock(copyPlayfield)

    return copyPlayfield
  }

  get lvl() {
    return Math.floor(this.lines * 0.1)
  }

  gameoverHandler() {
    if (this.isGameOver) {
      this.overlay.classList.remove('hidden')
      this.gameoverPopup.classList.remove('hidden')
      document.querySelector('.gameover__input').focus()
    } else {
      this.overlay.classList.add('hidden')
      this.gameoverPopup.classList.add('hidden')
    }
  }

  newGame() {
    this.tetrads = new Tetrads(this.rows)
    this.tetra = this.tetrads.getRandomTetra()
    this.nextTetra = this.tetrads.getRandomTetra()
    Preview.render(this.nextTetra)
    this._playfield = Array.from({ length: this.cols }, () => Array(this.rows).fill(0))
    this._score = 0
    this.lines = 0
    this.updateInterfaces()
  }

  moveLeft() {
    this.tetra.posX -= 1
    if (this.isCollisionMove()) {
      this.tetra.posX += 1
    }
  }

  moveRight() {
    this.tetra.posX += 1
    if (this.isCollisionMove()) {
      this.tetra.posX -= 1
    }
  }

  moveDown() {
    if (this.isGameOver) {
      this.gameoverHandler()
      return
    }

    this.tetra.posY += 1

    if (this.isCollisionMove()) {
      this.tetra.posY -= 1
      this.updateStateTetra()
    }

    this.gameoverState()
  }

  moveFastDown() {
    if (this.isGameOver) {
      this.gameoverHandler()
      return
    }

    this.tetra.posY = this.tetra.ghostPosY
    this.updateStateTetra()

    this.gameoverState()
  }

  gameoverState() {
    if (this.isCollisionMove()) {
      if (!this.isMute) {
        new Audio('./assets/audio/gameover.mp3').play()

      }

      this.isGameOver = true
    }
  }

  updateStateTetra() {
    this.tetraLock()
    this.updateScores(this.clearLines())
    this.updateInterfaces()
    this.createNewTetra()
    Preview.render(this.nextTetra)
  }

  isCollisionMove() {
    const { block, posX, posY } = this.tetra
    return block.some((row, y) => row.some((cell, x) => cell &&
      ((this._playfield[y + posY] === undefined || this._playfield[y + posY][x + posX] === undefined) ||
        this._playfield[y + posY][x + posX])))
  }

  rotateTetra() {
    const { block } = this.tetra
    const prevState = JSON.parse(JSON.stringify(block))
    for (let y = 0; y < block.length; y++) {
      for (let x = 0; x < y; x++) {
        [block[x][y], block[y][x]] = [block[y][x], block[x][y]]
      }
    }

    block.forEach(row => row.reverse())

    if (this.isCollisionMove()) this.tetra.block = prevState
  }

  createNewTetra() {
    this.tetra = this.nextTetra
    this.nextTetra = this.tetrads.getRandomTetra()
  }

  clearLines() {
    const countLines = this._playfield.reduce((acc, row, y) => row.every(cell => !!cell) ? acc.concat(y) : acc, [])
    const lineCount = countLines.length

    while (countLines.length) {
      const start = countLines.pop()
      this._playfield.splice(start, 1)

      if (!this.isMute) {
        new Audio('./assets/audio/success.mp3').play()
      }
    }

    this._playfield.unshift(...Array.from({ length: lineCount }, () => Array(this.rows).fill(0)))

    return lineCount
  }

  updateInterfaces() {
    document.querySelector('.score__text').textContent = this.score.toString()
    document.querySelector('.gameover__text').textContent = this.score.toString()
    document.querySelector('.level__text').textContent = this.lvl.toString()
    document.querySelector('.lines__text').textContent = this.lines.toString()
  }

  updateScores(lineCount) {
    this.score = lineCount && this.scores[lineCount - 1] * (this.lvl + 1)
    this.lines += lineCount
  }

  calculateGhostPosition() {
    const prevPosY = this.tetra.posY
    const prevPosX = this.tetra.posX

    while (!this.isCollisionMove()) {
      this.tetra.posY++
    }

    this.tetra.ghostPosY = --this.tetra.posY < -1 ? ++this.tetra.posY : this.tetra.posY
    this.tetra.ghostPosX = prevPosX
    this.tetra.posY = prevPosY
  }

  tetraLock(playfield = this._playfield) {
    const { block, posX, posY, ghostPosY, ghostPosX } = this.tetra

    block.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          playfield[y + posY][x + posX] = cell

          if (posY !== ghostPosY) {
            playfield[y + ghostPosY][x + ghostPosX] = 8
          } else {
            playfield[y + ghostPosY][x + ghostPosX] = cell
          }
        }
      })
    })
  }
}
