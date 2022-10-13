import { ApiService } from "@/services/apiService/api.service"
import { Endpoint } from "@/services/apiService/endpoint.enum"

export class EndpointApiService {
  protected readonly apiService = new ApiService()
  
  constructor(private readonly endpoint: Endpoint) {}

  protected buildUrl(params = ""): string {
    return `${this.endpoint}/${params}`
  }
}