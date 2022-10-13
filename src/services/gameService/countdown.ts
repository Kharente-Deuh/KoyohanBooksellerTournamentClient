import { levels } from "@/services/gameService/levels"
import P5 from "p5"
export const showCountDown = (p: P5, width: number, height: number, level: number, count: number): void => {
  p.text(`Niveau: ${level} / ${levels.length}`, width / 2 - 45, height / 2 - 20, 100, 200)
  p.text(count, width / 2, height / 2, 100, 100)
}