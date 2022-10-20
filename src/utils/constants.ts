export const colors = {
  red: "#e11f1c",
  black: "#1d1d1b",
  green: "#74bb85",
}

export const apiBaseUrl = process.env.VUE_APP_API_BASE_URL

export const librarianStart = "2022-10-20T00:00:00"

const addDaysToDate = (days: number, initialDate: Date): Date => {
  return new Date(initialDate.getTime() + days * 3600 * 24 * 1000)
}

export const customerStart = addDaysToDate(15, new Date(librarianStart))

export const eventEnd = addDaysToDate(15 + 14, new Date(librarianStart))
