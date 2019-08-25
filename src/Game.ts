import { Subject, Subscription, fromEvent, interval } from 'rxjs'

import { Z, Z2, I, L, L2, T, O } from './figures'
import Figure from './Figure'
import Square from './Square'

const squareWidth = 32
const numSquaresX = 10
const numSquaresY = 20
const canvasWidth = squareWidth * numSquaresX
const canvasHeight = squareWidth * numSquaresY

function createGrid(): Grid {
  return Array(numSquaresY)
    .fill(null)
    .map(() => Array(numSquaresX).fill(null))
}

function createRandomFigure(): Figure {
  const figures = [Z, Z2, I, L, L2, T, O]
  const random = Math.floor(Math.random() * figures.length - 1) + 1
  return new figures[random]()
}

function drawSquare(
  context: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number
) {
  context.fillStyle = 'black'
  context.fillRect(x, y, squareWidth, squareWidth)
  context.fillStyle = color
  context.fillRect(x + 1, y + 1, squareWidth - 2, squareWidth - 2)
}

type Grid = Array<Array<null | Square>>

class Game {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  grid: Grid
  activeFigure: Figure
  score = 0
  listenersAdded = false
  tickerSubscription: Subscription
  scoreSubject: Subject<number> = new Subject()
  gameOverSubject: Subject<number> = new Subject()

  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.background = 'black'

    this.addListeners()
    this.init()
  }

  init() {
    this.grid = createGrid()
    this.setScore(0)

    this.activeFigure = createRandomFigure()
  }

  addListeners() {
    this.listenersAdded = true

    fromEvent<KeyboardEvent>(document, 'keydown').subscribe(event => {
      if (event.code === 'ArrowLeft' && this.canMoveLeft()) {
        this.activeFigure.moveLeft()
        this.draw()
      } else if (event.code === 'ArrowRight' && this.canMoveRight()) {
        this.activeFigure.moveRight()
        this.draw()
      } else if (event.code === 'ArrowDown' && this.canMoveDown()) {
        this.activeFigure.moveDown()
        this.draw()
      } else if (event.code === 'ArrowUp') {
        this.activeFigure.rotate()
        if (!this.isValidPosition()) {
          this.activeFigure.undoRotate()
        }
        this.draw()
      } else if (event.code === 'Space' && this.canMoveDown()) {
        const interval = setInterval(() => {
          if (this.canMoveDown()) {
            this.activeFigure.moveDown()
          } else {
            clearInterval(interval)
            this.nextFigure()
          }
          this.draw()
        }, 10)
      }
    })
  }

  freezeActiveFigure() {
    this.activeFigure.coords.forEach(coord => {
      const [y, x] = coord
      this.grid[y][x] = new Square(this.activeFigure.color)
    })
  }

  draw() {
    const { context, grid } = this
    grid.forEach((row, i) => {
      row.forEach((item, j) => {
        const y = i * squareWidth
        const x = j * squareWidth
        if (item) {
          drawSquare(context, item.color, x, y)
        } else if (
          this.activeFigure.coords.find(
            square => square[0] === i && square[1] === j
          )
        ) {
          drawSquare(context, this.activeFigure.color, x, y)
        } else {
          context.strokeStyle = '#222'
          context.clearRect(x, y, squareWidth, squareWidth)
        }
      })
    })
  }

  checkCleared() {
    const { grid } = this
    let cleared = 0
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].every(item => !!item)) {
        grid[i].forEach(square => (square.color = 'white'))
        this.draw()

        // drop all above rows one level down
        for (let k = i; k > 0; k--) {
          for (let j = 0; j < numSquaresX; j++) {
            grid[k][j] = grid[k - 1][j]
          }
        }
        cleared += 1
      }
    }

    if (cleared) {
      this.setScore(this.score + cleared * cleared * 100)
    }
  }

  setScore(score) {
    this.score = score
    this.scoreSubject.next(score)
  }

  isValidPosition() {
    return this.activeFigure.coords.every(coord => {
      const [y, x] = coord
      return (
        y >= 0 &&
        x >= 0 &&
        y < numSquaresY &&
        x < numSquaresX &&
        this.grid[y][x] === null
      )
    })
  }

  canMoveDown() {
    return this.activeFigure.coords.every(coord => {
      const nextY = coord[0] + 1
      const nextX = coord[1]
      return nextY < numSquaresY && !this.grid[nextY][nextX]
    })
  }

  canMoveLeft() {
    return this.activeFigure.coords.every(coord => {
      const nextY = coord[0]
      const nextX = coord[1] - 1
      return nextX >= 0 && !this.grid[nextY][nextX]
    })
  }

  canMoveRight() {
    return this.activeFigure.coords.every(coord => {
      const nextY = coord[0]
      const nextX = coord[1] + 1
      return nextX < numSquaresX && !this.grid[nextY][nextX]
    })
  }

  nextFigure() {
    this.freezeActiveFigure()
    this.checkCleared()
    this.activeFigure = createRandomFigure()
    this.setScore(this.score + 10)
    if (!this.canMoveDown()) {
      this.gameOverSubject.next(this.score)
    }
  }

  start() {
    this.draw()
    this.tickerSubscription = interval(1000).subscribe(() => {
      if (this.canMoveDown()) {
        this.activeFigure.moveDown()
      } else {
        this.nextFigure()
      }
      this.draw()
    })
  }

  reset() {
    this.init()
  }

  stop() {
    this.tickerSubscription.unsubscribe()
  }
}

export default Game
