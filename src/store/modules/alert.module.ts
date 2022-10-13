import { Module, Mutation, VuexModule } from "vuex-module-decorators"
import store from "@/store"
import { AlertWithData, RequestAlert, RequestAlertType } from "@/global.types"

@Module({ namespaced: true, store })
export default class AlertModule extends VuexModule {
  requestAlert: RequestAlert | null = null

  @Mutation
  RESELT_ALERT_STATES(): void {
    this.requestAlert = null
  }

  @Mutation
  ALERT_SUCCESS(message: string): void {
    this.requestAlert = {
      type: RequestAlertType.Success,
      message
    }
  }

  @Mutation
  ALERT_SUCCESS_WITH_DATA(data: AlertWithData): void {
    this.requestAlert = {
      type: RequestAlertType.Success,
      message: data.message,
      messageData: data.data,
      pluralize: data.pluralize
    }
  }

  @Mutation
  ALERT_ERROR(message: string): void {
    this.requestAlert = {
      type: RequestAlertType.Error,
      message
    }
  }
}