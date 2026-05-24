export interface CollageDateMapping {
  date: string
  index: number
}

export const dateMapping: CollageDateMapping[] = Array.from({ length: 19 }, (_, index) => ({
  date: `May ${6 + index}`,
  index,
}))

export async function getCollageSlices(
  imageUrl: string,
  rows: number,
  cols: number,
  count: number,
): Promise<string[]> {
  const image = new Image()
  image.crossOrigin = 'anonymous'

  const loadPromise = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error(`Failed to load collage image: ${imageUrl}`))
  })

  image.src = imageUrl
  await loadPromise

  const width = image.naturalWidth
  const height = image.naturalHeight
  const cellWidth = Math.floor(width / cols)
  const cellHeight = Math.floor(height / rows)

  const canvas = document.createElement('canvas')
  canvas.width = cellWidth
  canvas.height = cellHeight
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is not available')
  }

  const slices: string[] = []
  const total = Math.min(count, rows * cols)

  for (let index = 0; index < total; index += 1) {
    const col = index % cols
    const row = Math.floor(index / cols)
    const sx = col * cellWidth
    const sy = row * cellHeight

    context.clearRect(0, 0, cellWidth, cellHeight)
    context.drawImage(image, sx, sy, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight)
    slices.push(canvas.toDataURL('image/png'))
  }

  return slices
}
