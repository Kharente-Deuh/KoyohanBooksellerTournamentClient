import P5 from "p5"

import { Fighter } from "@/services/gameService/fighter"
import { showCountDown } from "@/services/gameService/countdown"
import { Enemy, EnemyType } from "@/services/gameService/enemy"
import { levels } from "@/services/gameService/levels"
import { Wall } from "@/services/gameService/wall"
import { Volley } from "@/services/gameService/volley"
import { Missile } from "@/services/gameService/missile";
import { Fire } from "@/services/gameService/fire";
import { Star } from "@/services/gameService/star"
import { showScore } from "@/services/gameService/score"
import { showLives } from "@/services/gameService/life"

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type GameEndCallback = (score: number, duration: number, isVictory: boolean) => void

export const startGame = (width: number, height: number, onGameEnd: GameEndCallback): P5 => {
  const sketch = (p: P5): void => {
    let lives = 3
    let isStarted = false
    let fighter: Fighter
    let countdown = 4
    let score = 0
    let level = 1
    let canvas
    let enemyFireInterval
    let enemies: Enemy[] = []
    let walls: Wall[] = []
    let volleys: Volley[] = []
    let missiles: Missile[] = []
    let fires: Fire[] = []
    const stars: Star[] = []
    for (let i = 0; i < 100; i++) {
      stars.push(new Star(width, height))
    }

    let isAlive = true
    let missileCooldown = false
    let startTime = 0

    const endGame = (isVictorious: boolean): void => {
      p.noLoop()
      onGameEnd(score, new Date().getTime() - startTime, isVictorious)
    }

    const startSetup = () => {
      fighter = new Fighter(p, width, height)

      // GENERATE ENEMIES
      for (let i = 0; i < 33; i++) {
        const type = i < 11 ? EnemyType.TIE : EnemyType.TIE_ONE
        const speed = levels[level - 1].speed
        let x = (i - 22) * 50 + 80
        let y = 160

        if (i >= 0 && i < 11) {
          x = i * 50 + 80
          y = 40
        }

        if (i >= 11 && i < 22) {
          x = (i - 11) * 50 + 80
          y = 100
        }

        if (i >= 22) {
          x = (i - 22) * 50 + 80
          y = 160
        }

        enemies.push(new Enemy(p, type, speed, x, y))
      }

      // GENERATE WALLS
      for (let i = 0; i < 3; i++) {
        walls.push(new Wall(p, i * 240 + 80, height - 200))
      }

      enemyFireInterval = setInterval(() => {
        if (lives <= 0 || isStarted == false) {
          return
        }

        if (enemies.length <= 0 || countdown > 0) {
          return
        }

        const random = parseInt(Math.floor(Math.random() * enemies.length).toString());
        const volley = new Volley(enemies[random].x + enemies[random].radius, enemies[random].y + 5);
        volleys.push(volley)
      }, levels[level - 1].interval)
    }

    p.setup = () => {
      canvas = p.createCanvas(width, height)
      canvas.parent("canvas")
      isStarted = true
      startTime = new Date().getTime()
      startSetup()
    }

    p.draw = () => {
      p.background(0)
      p.textSize(15)
      p.fill(255, 254, 247)
      stars.forEach(s => s.show(p))

      if (enemies.length === 0) {
        missiles = []
        fires = []
        volleys = []
        level++
        if (level > levels.length) {
          endGame(true)
          return
        }

        clearInterval(enemyFireInterval)
        countdown = 4
        fighter.toggleMoveLeft(false)
        fighter.toggleMoveRight(false)
        startSetup()
      }

      if (isStarted) {
        drawObjects(drawMovement)
      }
    }

    const drawObjects = (drawMvt: () => void): void => {
      if (lives === 0) {
        isStarted = false
        endGame(false)
        return
      }

      if (isStarted && countdown > 0) {
        showCountDown(p, width, height, level, countdown)
      }

      showScore(p, score)
      showLives(p, lives, width)
      fighter.show(p);
      enemies.forEach(e => e.show(p))
      walls.forEach(w => w.show(p))

      if (drawMvt !== undefined && isAlive && isStarted && countdown === 0) {
        drawMvt()
      }
    }

    const drawMovement = (): void => {
      enemies.forEach(e => {
        e.move()
        if (e.hits(p, fighter)) {
          lives--
        }
      })

      const edgedEnemy = enemies.find(({ x, radius }) => x + (radius * 2) >= width || x - (radius * 2) <= 0)
      if (edgedEnemy) {
        enemies.forEach(e => e.reverse())
      }

      missiles.forEach(m => {
        m.show(p)
        m.move()

        const aliveEnemies = enemies.filter(e => !m.hits(p, e))
        if (aliveEnemies.length < enemies.length) {
          score += (enemies.length - aliveEnemies.length) * 20
          m.killEnemy()
        }

        enemies = [...aliveEnemies]

        const hitsWall = walls.find(w => m.hitsWall(p, w))
        if (hitsWall) {
          m.killWall()
        }
      })

      missiles = missiles.filter(({ toggleEnemy, toggleWall }) => !toggleEnemy && !toggleWall)

      volleys.forEach(v => {
        v.show(p)
        v.move()
        if (v.hits(p, fighter)) {
          v.kill()
          lives--
        }

        const damagedWalls = walls.filter(w => v.hitsWall(p, w))
        damagedWalls.forEach(w => {
          fires.push(new Fire(p, w.x, w.y))
          w.takeDamage()
        })

        if (damagedWalls.length > 0) {
          v.kill()
        }
      })

      walls
        .filter(({ isDestroyed }) => isDestroyed)
        .forEach(w => { fires = fires.filter(f => !f.proximity(p, w)) })
      walls = walls.filter(({ isDestroyed }) => !isDestroyed)
      volleys = volleys.filter(({ isAlive }) => isAlive)
      fires.forEach(f => f.show(p))
      if (lives === 0) {
        isAlive = false
      }
    }

    p.keyReleased = (evt?: any | undefined) => {
      if (!evt) {
        return
      }

      const keyCode: number = evt.keyCode
      if (keyCode === 37) {
        fighter.toggleMoveLeft(false)
      }
      if (keyCode === 39) {
        fighter.toggleMoveRight(false)
      }
    }

    const cooldown = () => {
      setTimeout(() => {
        missileCooldown = false
      }, 1000)
    }

    p.keyPressed = (evt?: any | undefined): void => {
      if (countdown > 0) {
        return
      }

      if (!evt) {
        return
      }

      const keyCode: number = evt.keyCode
      switch (keyCode) {
        case 37:
          if (countdown === 0) {
            fighter.toggleMoveLeft(true)
          }
          break;
        case 39:
          if (countdown === 0) {
            fighter.toggleMoveRight(true)
          }
          break
        case 32:
          if (missileCooldown || countdown > 0) {
            break
          }

          missiles.push(...fighter.fire())
          sleep(150).then(() => {
            missiles.push(...fighter.fire())
          })

          missileCooldown = true
          cooldown()
          break
      }
    }

    setInterval(() => {
      if (!isStarted) {
        return
      }

      if (countdown > 0) {
        countdown--;
      }
    }, 1000);
  }

  return new P5(sketch)
}