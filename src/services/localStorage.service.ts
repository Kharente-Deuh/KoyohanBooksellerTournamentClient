enum LocalStorageData {
  ACCESS_TOKEN = "jwt",
  REFRESH_TOKEN = "refreshToken"
}

export class LocalStorageService {
  setAccessToken(token: string): void {
    this.setItem(LocalStorageData.ACCESS_TOKEN, token)
  }

  removeAccessToken(): void {
    this.removeItem(LocalStorageData.ACCESS_TOKEN)
  }

  getAccessToken(): string | null {
    return this.getItem(LocalStorageData.ACCESS_TOKEN)
  }

  setRefreshToken(token: string): void {
    this.setItem(LocalStorageData.REFRESH_TOKEN, token)
  }

  removeRefreshToken(): void {
    this.removeItem(LocalStorageData.REFRESH_TOKEN)
  }

  getRefreshToken(): string | null {
    return this.getItem(LocalStorageData.REFRESH_TOKEN)
  }

  private setItem(item: LocalStorageData, data: string): void {
    localStorage.setItem(item, data)
  }

  private getItem(item: LocalStorageData): string | null {
    return localStorage.getItem(item)
  }

  private removeItem(item: LocalStorageData): void {
    localStorage.removeItem(item)
  }
}