import { HttpService } from "@/services/http.service";
import { AxiosRequestConfig } from "axios";
import { LocalStorageService } from "@/services/localStorage.service";
import { logout } from "@/services/firebase.service";
import { Endpoint } from "@/services/apiService/endpoint.enum";
import { apiBaseUrl } from "@/utils/constants";

export class ApiService extends HttpService {
  private readonly localStorageService = new LocalStorageService()
  constructor() {
    super(apiBaseUrl ?? "")
    super.setRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
      if (!config.headers) {
        return config;
      }

      const token = this.localStorageService.getAccessToken()
      if (token !== null) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    })

    super.setResponseInterceptors(
      undefined,
      async (error: any): Promise<any> => {
        const config = error.config;

        if (!error.response ||
          error.response.status !== 401 ||
          config._retry === true) {
          return Promise.reject(error);
        }

        config._retry = true;

        const refreshToken = this.localStorageService.getRefreshToken()
        if (refreshToken === null) {
          return this.axiosInstance(config)
        }

        try {
          const res = await this.axiosInstance.get<{ accessToken: string }>(`${apiBaseUrl}${Endpoint.AUTH}/token/refresh?token=${refreshToken}`)
          const accessToken = res.data.accessToken
          if (accessToken) {
            this.localStorageService.setAccessToken(accessToken)
          }

          return this.axiosInstance(config);
        } catch (err) {
          console.error('LOOGOUT', err)
          logout()
        }
      })
  }
}