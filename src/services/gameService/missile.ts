import { Enemy } from "@/services/gameService/enemy";
import { Wall } from "@/services/gameService/wall";
import P5 from "p5"

export class Missile {
  public radius = 15;
  public toggleEnemy = false;
  public toggleWall = false;

  constructor(
    public x: number,
    public y: number,
    public focus: number
  ) {
    console.log(`[Missile] { ${this.x}, ${this.y} }, ${this.focus}`)
  }

  show(p: P5): void {
    p.fill(0, 255, 255)
    p.rect(this.x, this.y, 3, this.radius)
  }

  move(): void {
    this.y -= 5
    this.x += this.focus / 3
  }

  killEnemy(): void {
    this.toggleEnemy = true
  }

  killWall(): void {
    this.toggleWall = true
  }

  hits(p: P5, enemy: Enemy): boolean {
    const distance = p.dist(this.x, this.y, enemy.x + enemy.radius, enemy.y);
    return distance <= this.radius
  }

  hitsWall(p: P5, wall: Wall): boolean {
    const distance = p.dist(this.x, this.y,  wall.x + 75, wall.y - 40);
    return distance <= this.radius + 70
  }
}