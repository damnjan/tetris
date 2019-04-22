export function convertDrawingToCoords(drawing: Array<string>) {
  const result = []
  for (let i = 0; i < drawing.length; i++) {
    for (let j = 0; j < drawing[0].length; j++) {
      if (drawing[i][j] === '#') {
        result.push([i, j])
      }
    }
  }

  return result
}

export function rotateDrawing(drawing: Array<string>) {
  const matrix = drawing.map(row => row.split('')).reverse()

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < i; j++) {
      var temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  return matrix.map(row => row.join(''))
}
