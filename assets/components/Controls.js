import Player from './Player.js'

export default class Controls {
  playBtn = document.querySelector('.controls__btn')
  controlsBtnClose = document.querySelector('.controls-help__close-btn')
  controlsBtnOpen = document.getElementById('controls-btn')
  controlsPopup = document.querySelector('.controls-help')
  recordsBtnClose = document.querySelector('.records__close-btn')
  recordsBtnOpen = document.getElementById('records-btn')
  recordsPopup = document.querySelector('.records')
  gameoverForm = document.querySelector('.gameover__form')
  volumeBtn = document.getElementById('volume-btn')
  overlay = document.querySelector('.overlay')
  isPaused = true
  isMute = false


  constructor(game, canvas, playfield, records) {
    this.game = game
    this.canvas = canvas
    this.playfield = playfield
    this.records = records

    document.addEventListener('keydown', this.keyDownHandler.bind(this))
    document.addEventListener('keyup', this.keyUpHandler.bind(this))

    this.gameoverForm.addEventListener('submit', (evt) => {
      evt.preventDefault()
      const { username } = Object.fromEntries(new FormData(evt.target))

      if (username) {
        this.player = new Player(username, game.score)
      } else {
        this.player = new Player(`Player ${this.records.players.length + 1}`, game.score)
      }

      this.records.addPlayerRecord(this.player)
      localStorage.setItem('records', JSON.stringify(this.records.players))
      this.records.updateRecordsTable()
      this.gameoverForm.reset()
      this.resetGame()
      this.game.gameoverHandler()
      this.gamePauseHandler()
    })

    this.volumeBtn.addEventListener('click', () => {
      if (this.volumeBtn.classList.contains('controls__list-btn--volume-icon--mute')) {
        this.volumeBtn.classList.remove('controls__list-btn--volume-icon--mute')
        this.game.isMute = this.isMute = false
      } else {
        this.volumeBtn.classList.add('controls__list-btn--volume-icon--mute')
        this.game.isMute = this.isMute = true
      }
    })

    this.controlsBtnClose.addEventListener('click', () => {
      this.controlsPopup.classList.add('hidden')
    })

    this.controlsBtnOpen.addEventListener('click', () => {
      this.controlsPopup.classList.toggle('hidden')
    })

    this.recordsBtnClose.addEventListener('click', () => {
      this.overlay.classList.add('hidden')
      this.recordsPopup.classList.add('hidden')

      this.autoMove()
    })

    this.recordsBtnOpen.addEventListener('click', () => {
      this.controlsPopup.classList.add('hidden')

      this.overlay.classList.remove('hidden')
      this.recordsPopup.classList.remove('hidden')
      this.stopMove()
    })

    this.playBtn.addEventListener('click', this.gamePauseHandler.bind(this))
  }

  gamePauseHandler() {
    if (!this.isPaused) {
      this.isPaused = true
      this.playfield.classList.add('game__playfield--paused')
      this.playBtn.innerHTML = `play<span class="dash">_</span>`
      document.querySelector('.header').style.animationPlayState = 'paused'
      this.stopMove()
    } else {
      this.isPaused = false
      this.playfield.classList.remove('game__playfield--paused')
      this.playBtn.innerHTML = `paused<span class="dash">_</span>`
      document.querySelector('.header').style.animationPlayState = 'running'
      this.autoMove()
    }
  }

  resetGame() {
    if (this.game.isGameOver) {
      this.isPaused = false
      this.game.newGame()
      this.canvas.render(this.game._playfield)
      this.game.isGameOver = false
    }
  }

  keyDownHandler(evt) {
    if (!this.isPaused) {
      switch (evt.key) {
        case 'ArrowDown':
          this.stopMove()
          this.canvas.render(this.game.playfield)
          this.game.moveDown()
          break
        case 'ArrowLeft':
          this.game.moveLeft()
          this.canvas.render(this.game.playfield)
          break
        case 'ArrowRight':
          this.game.moveRight()
          this.canvas.render(this.game.playfield)
          break
        case 'ArrowUp':
          this.game.rotateTetra()
          this.canvas.render(this.game.playfield)
          break

        case ' ':
          evt.preventDefault()
          if (this.game.tetra.ghostPosY >= 0) {
            if (!this.isMute) {
              new Audio('./assets/audio/beep.mp3').play()
            }

            this.game.moveFastDown()
            this.canvas.render(this.game.playfield)
          }
          break
        default:
          break
      }
    }
  }

  keyUpHandler(evt) {
    if (!this.isPaused) {
      if (evt.key === 'ArrowDown') {
        this.autoMove()
      }
    }
  }

  autoMove() {
    const speed = 1000 - this.game.lvl * 100

    if (!this.isPaused) {
      this.interval = setInterval(() => {
        this.canvas.render(this.game.playfield)
        this.game.moveDown()
      }, speed > 0 ? speed : 100)
    }
  }

  stopMove() {
    clearInterval(this.interval)
  }
}