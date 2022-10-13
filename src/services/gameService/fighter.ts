import { Missile } from "@/services/gameService/missile"
import P5 from "p5"

export class Fighter {
  public direction = 0
  public radius = 20
  public x: number
  public y: number
  private readonly asset: P5.Image
  private moveLeftToggled = false
  private moveRightToggled = false

  constructor(p: P5, private readonly width: number, height: number) {
    this.x = width / 2
    this.y = height - 60
    this.asset = p.loadImage("./images/fighter.png")
  }

  toggleMoveLeft(val: boolean): void {
    if (val && this.moveRightToggled) {
      this.moveRightToggled = false
    }

    this.moveLeftToggled = val
  }

  toggleMoveRight(val: boolean): void {
    if (val && this.moveLeftToggled) {
      this.moveLeftToggled = false
    }

    this.moveRightToggled = val
  }

  private moveLeft(): void {
    if (this.x - this.radius - 4 >= 0) {
      this.x -= 4
    }
  }

  private moveRight(): void {
    if (this.x + this.radius + 4 < this.width) {
      this.x += 4
    }
  }

  fire(): Missile[] {
    console.log(`[Fighter] { ${this.x}, ${this.y} }`)
    return [
      new Missile(this.x + 0, this.y + 0, 1),
      new Missile(this.x + 55, this.y + 0, -1)
    ]
  }

  show(p: P5): void {
    if (this.moveRightToggled !== this.moveLeftToggled) {
      if (this.moveRightToggled) {
        this.moveRight()
      }

      if (this.moveLeftToggled) {
        this.moveLeft()
      }
    }

    p.image(this.asset, this.x, this.y, this.radius * 3, this.radius * 3)
  }
} 
