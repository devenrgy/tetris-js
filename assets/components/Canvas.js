export default class Canvas {
  canvas = document.getElementById('playfield')
  canvasH = this.canvas.clientHeight
  canvasW = this.canvas.clientWidth
  ctx = this.canvas.getContext('2d')
  colors = ['#4f9434', '#54b7e0', '#f9d95b', '#f0a63c', '#d23620', '#eb7b88', '#c07ed7', 'rgb(255,255,255, 10%)']

  constructor(cols, rows) {
    this.canvas.width = this.canvasW
    this.canvas.height = this.canvasH
    this.cellSize = this.canvasW / rows
    this.rows = rows
    this.cols = cols
    this.gap = this.cellSize / 10
    this.createGrid()
  }

  createGrid() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#262626'

    for (let i = 0; i <= this.canvasW; i += this.canvasW / this.rows) {
      this.ctx.moveTo(i, 0)
      this.ctx.lineTo(i, this.canvasH)
    }

    for (let i = 0; i <= this.canvasH; i += this.canvasH / this.cols) {
      this.ctx.moveTo(0, i)
      this.ctx.lineTo(this.canvasW, i)
    }

    this.ctx.stroke()
    this.ctx.closePath()
  }

  render(playfield) {
    this.clearCanvas()
    this.createGrid()

    playfield.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          this.ctx.beginPath()
          this.ctx.fillStyle = this.colors[cell - 1]
          this.ctx.fillRect(x * this.cellSize + this.gap / 2, y * this.cellSize + this.gap / 2, this.cellSize - this.gap, this.cellSize - this.gap)
        } else {
          this.ctx.closePath()
        }
      })
    })
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)
  }
}
