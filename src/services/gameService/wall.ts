import P5 from "p5"

export class Wall {
  public isDestroyed = false
  private readonly asset: P5.Image
  private damage = 0

  constructor(p: P5, public x: number, public y: number) {
    this.asset = p.loadImage("./images/wall.png")
  }

  show(p: P5): void {
    p.image(this.asset, this.x, this.y, 160, 60)
  }

  takeDamage(): void {
    if (this.damage < 10) {
      this.damage++
    } else {
      this.isDestroyed = true
    }
  }
}