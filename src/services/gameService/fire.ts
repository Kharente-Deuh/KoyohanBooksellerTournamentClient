import { Wall } from "@/services/gameService/wall"
import P5 from "p5"

export class Fire {
  private readonly x: number
  private readonly y: number
  private readonly width = 40
  private readonly height = 20
  private readonly asset: P5.Image

  constructor(p: P5, x: number, y: number) {
    this.x = Math.floor(Math.random() * ((x + 120) - (x - 0) + 1)) + (x - 0);
    this.y = Math.floor(Math.random() * ((y + 27) - (y + 5))) + (y + 5);
    this.asset = p.loadImage("./images/fire.png")
  }

  show(p: P5): void {
    p.image(this.asset, this.x, this.y, this.width, this.height)
  }

  proximity(p: P5, wall: Wall): boolean {
    const distance = p.dist(this.x, this.y, wall.x + 50, wall.y + 20);
    return distance <= 150
  }
}