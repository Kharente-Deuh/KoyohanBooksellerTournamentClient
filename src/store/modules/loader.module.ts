import { Module, Mutation, VuexModule } from "vuex-module-decorators"

@Module({ namespaced: true })
export default class LoaderModule extends VuexModule {
  loading = false
  
  @Mutation
  TOGGLE_PAGE_LOADING(val: boolean): void {
    this.loading = val
  }
}