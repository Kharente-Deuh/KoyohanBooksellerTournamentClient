import { UserService } from "@/services/apiService"
import { GameScore, User } from "@/services/apiService/types"
import { Module, Mutation, Action, VuexModule } from "vuex-module-decorators"


@Module({ namespaced: true })
export default class UserModule extends VuexModule {
  private readonly userService = new UserService()

  user: User | null = null
  users: User[] = []

  @Mutation
  SET_USER(val: User | null): void {
    this.user = val
  }

  @Mutation
  SET_USERS(val: User[]): void {
    this.users = val
  }

  @Mutation
  UPDATE_SCORE(val: User): void {
    this.user = val
    this.users = this.users.filter(({ id }) => id !== val.id)
    this.users.push(val)
  }

  @Action({ rawError: true, commit: 'SET_USER' })
  async fetchCurrentUser(): Promise<User> {
    if (this.user) {
      return this.user
    }

    return this.userService.fetchCurrentUser()
  }

  @Action({ rawError: true, commit: "SET_USERS" })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers()
  }

  @Action({ rawError: true, commit: "UPDATE_SCORE" })
  async updateScore(score: GameScore): Promise<User> {
    return this.userService.updateScore(score)
  }
}
