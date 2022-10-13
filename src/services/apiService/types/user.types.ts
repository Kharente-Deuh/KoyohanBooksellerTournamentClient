export enum UserType {
  LIBRARIAN = "libraire",
  CUSTOMER = "client"
}

export type User = {
  id: string
  name: string
  highScore: GameScore | null
  type: UserType
}

export type GameScore = {
  score: number
  time: number
}