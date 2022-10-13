import { Fighter } from "@/services/gameService/fighter";
import P5 from "p5"

export enum EnemyType {
  TIE = 0,
  TIE_ONE = 1
}

export class Enemy {
  public readonly radius = 20
  private readonly asset: P5.Image

  constructor(
    p: P5,
    type: EnemyType,
    public speed: number,
    public x: number,
    public y: number,
  ) {
    this.asset = p.loadImage(type === EnemyType.TIE ? "./images/enemy_horizontal.png" : "./images/enemy_vertical.png")
  }

  show(p: P5): void {
    p.image(this.asset, this.x, this.y, this.radius * 2, this.radius * 2)
  }

  move(): void {
    this.x += this.speed
  }

  reverse(): void {
    this.speed *= -1
    this.y += 10
  }

  hits(p: P5, fighter: Fighter): boolean {
    const dist = p.dist(this.x, this.y, fighter.x + fighter.radius, fighter.y + 10)
    return dist <= fighter.radius + 15
  }
}