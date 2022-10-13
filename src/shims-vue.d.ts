import { Route, Location } from "vue-router"

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: (location?: Location) => void): void
    beforeRouteUpdate?(to: Route, from: Route, next: (location?: Location) => void): void
  }
}