import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosResponseHeaders,
} from "axios";

export class HttpService {
  protected readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string, headers?: AxiosRequestHeaders) {
    this.axiosInstance = axios.create({ baseURL, headers });
  }

  static objectToQueryParamsString(obj: any): string {
    const qpString = Object.keys(obj)
      .map(key => `${key}=${obj[key]}`)
      .join('&')

    return '?' + qpString
  }

  setRequestInterceptor(interceptor: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>): void {
    this.axiosInstance.interceptors.request.use(interceptor);
  }

  setResponseInterceptors(
    success?: (response: AxiosResponse) => AxiosResponse,
    error?: (error: any) => Promise<any>
  ): void {
    this.axiosInstance.interceptors.response.use(success, error);
  }

  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.axiosInstance.get<T>(endpoint, config);
    return data
  }

  async getWithHeader<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<{ data: T, headers: AxiosResponseHeaders }> {
    const { data, headers } = await this.axiosInstance.get<T>(endpoint, config);
    return { data, headers: headers as AxiosResponseHeaders }
  }

  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  }

  async patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }
}