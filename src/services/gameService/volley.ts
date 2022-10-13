import { Fighter } from "@/services/gameService/fighter"
import { Wall } from "@/services/gameService/wall"
import P5 from "p5"

export class Volley {
  private radius = 15
  public isAlive = true

  constructor(
    private x: number,
    private y: number
  ) {}

  show(p: P5): void {
    p.fill(255, 0, 0)
    p.rect(this.x, this.y, 5, this.radius * 2)
  }

  move(): void {
    this.y += 5
  }

  hits(p: P5, fighter: Fighter): boolean  {
    const distance = p.dist(this.x, this.y, fighter.x + fighter.radius, fighter.y + 10);
    return distance <= fighter.radius + 15
  }

  hitsWall(p: P5, wall: Wall): boolean  {
    const distance = p.dist(this.x, this.y, wall.x + 77, wall.y + 65);
    return distance <= this.radius + 70
  }

  kill(): void {
    this.isAlive = false
  }
}