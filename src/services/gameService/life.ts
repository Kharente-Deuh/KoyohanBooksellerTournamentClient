import P5 from "p5"

export const showLives = (p: P5, lives: number, width: number): void => {
  const text = `Vies: ${lives}`
  const x = width - 100
  const y = 10
  const x2 = 100
  const y2 = 100
  p.text(text, x, y, x2, y2)
}