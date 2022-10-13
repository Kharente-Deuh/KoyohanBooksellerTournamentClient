import P5 from "p5"

export const showScore = (p: P5, score: number): void => {
  const text = `Score: ${score}`
  const xy = 10
  const x2y2 = 100
  p.text(text, xy, xy, x2y2, x2y2)
}