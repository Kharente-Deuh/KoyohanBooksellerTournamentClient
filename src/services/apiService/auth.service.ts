import { EndpointApiService } from "@/services/apiService/endpoint-api.service";
import { Endpoint } from "@/services/apiService/endpoint.enum";
import { AuthToken, LoginPayload, RegisterPayload, ResetPasswordPayload, SendActivationPayload, SendResetPasswordPayload } from "@/services/apiService/types";
import { LocalStorageService } from "@/services/localStorage.service";

export class AuthService extends EndpointApiService {
  private readonly localStorageService = new LocalStorageService()
  constructor() {
    super(Endpoint.AUTH)
  }

  async login(payload: LoginPayload): Promise<void> {
    const url = this.buildUrl('local')
    try {
      const { accessToken, refreshToken } = await this.apiService.post<AuthToken>(url, payload)
      this.localStorageService.setAccessToken(accessToken)
      if (refreshToken) {
        this.localStorageService.setRefreshToken(refreshToken)
      }
    } catch (error: any) {
      console.error(error)
      throw error
    }
  }

  async register(payload: RegisterPayload): Promise<void> {
    const url = this.buildUrl('register')
    try {
      await this.apiService.post<void>(url, payload)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async sendActivationEmail(payload: SendActivationPayload): Promise<void> {
    const url = this.buildUrl(`activate/${payload.email}`)
    try {
      await this.apiService.post<void>(url, { recaptcha: payload.recaptcha })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async sendResetPassword(payload: SendResetPasswordPayload): Promise<void> {
    const url = this.buildUrl(`password/reset/${payload.email}`)
    try {
      await this.apiService.post<void>(url, { recaptcha: payload.recaptcha })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    const url = this.buildUrl("password/reset")
    try {
      await this.apiService.post<void>(url, payload)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}