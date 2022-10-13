import P5 from "p5"

export class Star {
  private readonly radius = Math.floor(Math.random() * 3)
  private readonly x: number
  private readonly y: number

  constructor(width: number, height: number) {
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
  }

  show(p: P5): void {
    p.fill(255, 255, 255)
    p.ellipse(this.x, this.y, this.radius * 2)
  }
}