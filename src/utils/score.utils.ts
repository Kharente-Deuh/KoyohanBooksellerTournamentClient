import { GameScore } from "@/services/apiService/types"

export const isBetter = (a: GameScore | null, b: GameScore | null): boolean => {
  if (a === null) {
    return false
  }

  if (b === null) {
    return true
  }

  if (a.score == b.score) {
    return a.time < b.time
  }

  return a.score > b.score
}

export const timeToString = (time: number): string => {
  const sSplit = (time / 1000.0).toString().split('.')
  const seconds = parseInt(sSplit[0])
  const ms = sSplit.length === 2 ? parseInt(sSplit[1]) : 0

  if (seconds < 60) {
    return `${seconds}s ${ms}ms`
  }

  const mSplit = (seconds / 60.0).toString().split('.')
  const minutes = parseInt(mSplit[0])
  let s = "0"

  if (mSplit.length === 2) {
    let secPercent = parseInt(mSplit[1])
    for (let i = 0; i < mSplit[1].toString().length; i++) {
      secPercent /= 10
    }

    s = (secPercent * 60).toFixed()
  }


  const hSplit = (minutes / 60.0).toString().split('.')
  const h = parseInt(hSplit[0])
  let m = "0"

  if (hSplit.length === 2) {
    let minutesAsPerc = parseInt(hSplit[1])
    for (let i = 0; i < hSplit[1].toString().length; i++) {
      minutesAsPerc /= 10
    }

    m = (minutesAsPerc * 60).toFixed()
  }

  const r: string[] = []
  if (h > 0) {
    r.push(`${h}h`)
  }

  r.push(`${m}m`)
  r.push(`${s}s`)
  r.push(`${ms}ms`)
  return r.join(' ')
}