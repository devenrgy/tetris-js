export default class Preview {
  static canvas = document.getElementById('preview')
  static canvasH = this.canvas.clientHeight
  static canvasW = this.canvas.clientWidth
  static ctx = this.canvas.getContext('2d')
  static cellSize = 24

  static render({ block }) {
    this.clearCanvas()
    block.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          this.ctx.beginPath()
          this.ctx.fillStyle = 'white'
          this.ctx.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
          this.ctx.fill()
        } else {
          this.ctx.closePath()
        }
      })
    })
  }

  static clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)
  }
}
