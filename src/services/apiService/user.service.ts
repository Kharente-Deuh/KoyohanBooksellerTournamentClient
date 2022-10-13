import { EndpointApiService } from "@/services/apiService/endpoint-api.service"
import { Endpoint } from "@/services/apiService/endpoint.enum"
import { GameScore, User } from "@/services/apiService/types"

export class UserService extends EndpointApiService {
  constructor() {
    super(Endpoint.USER)
  }

  async fetchCurrentUser(): Promise<User> {
    const url = this.buildUrl("whoami")
    try {
      return this.apiService.get<User>(url)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getUsers(): Promise<User[]> {
    const url = this.buildUrl("")
    try {
      return this.apiService.get<User[]>(url)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateScore(score: GameScore): Promise<User> {
    const url = this.buildUrl("score")
    try {
      return this.apiService.put<User>(url, score)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}