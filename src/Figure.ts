import { convertDrawingToCoords, rotateDrawing } from './helpers'

abstract class Figure {
  abstract color: string
  drawing:Array<string>
  prevDrawing: Array<string>
  coords: Array<Array<number>>

  private offsetY = 0
  private offsetX = 0

  constructor(drawing){
    this.drawing = this.prevDrawing = drawing
    this.setCoordsFromDrawing()
  }

  setCoordsFromDrawing() {
    this.coords = convertDrawingToCoords(this.drawing)
    for (let i = 0; i < this.offsetX; i++ ) {
      this.moveRight(false)
    }
    for (let i = 0; i < this.offsetY; i++ ) {
      this.moveDown(false)
    }
  }

  moveDown(writeOffset = true) {
    const { coords } = this
    for (let i = 0; i < coords.length; i++) {
      const [y, x] = coords[i]
      coords[i] = [y + 1, x]
    }

    if (writeOffset) {
      this.offsetY += 1
    }
  }

  moveLeft(writeOffset = true) {
    const { coords } = this
    for (let i = 0; i < coords.length; i++) {
      const [y, x] = coords[i]
      coords[i] = [y, x - 1]
    }

    if (writeOffset) {
      this.offsetX -= 1
    }
  }

  moveRight(writeOffset = true) {
    const { coords } = this
    for (let i = 0; i < coords.length; i++) {
      const [y, x] = coords[i]
      coords[i] = [y, x + 1]
    }

    if (writeOffset) {
      this.offsetX += 1
    }
  }

  rotate() {
    this.prevDrawing = this.drawing
    this.drawing = rotateDrawing(this.drawing)
    this.setCoordsFromDrawing()
  }

  undoRotate() {
    this.drawing = this.prevDrawing
    this.setCoordsFromDrawing()
  }
}

export default Figure
