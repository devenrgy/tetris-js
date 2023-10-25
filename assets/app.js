import Game from './components/Game.js'
import Canvas from './components/Canvas.js'
import Records from './components/Records.js'
import Controls from './components/Controls.js'

document.addEventListener('DOMContentLoaded', () => {
  const playfield = document.querySelector('.game__playfield')
  const game = new Game(playfield)
  const canvas = new Canvas(game.cols, game.rows)
  const records = new Records()
  const controls = new Controls(game, canvas, playfield, records)
})
