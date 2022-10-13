<template>
  <v-app>
    <v-main id="main">
      <nav-bar v-if="isAuthRoute === false" />
      <div v-show="loading" class="page-loader">
        <v-progress-circular
          id="progress"
          size="100"
          :color="colors.green"
          indeterminate
        />
      </div>
      <router-view v-show="!loading" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "@/components/NavBar/NavBar.vue";
import { AuthRoutes, RouteName } from "@/router/types";
import { namespace } from "vuex-class";
import { colors } from "@/utils/constants";

const components = { NavBar };

const Store = {
  LoaderModule: namespace("loader"),
};

@Component({ components })
export default class App extends Vue {
  @Store.LoaderModule.State
  readonly loading: boolean;

  readonly colors = colors;

  get isAuthRoute(): boolean {
    console.log(this.$route.name);
    if (!this.$route.name) {
      return false;
    }

    if (this.$route.name === RouteName.HOME) {
      return true
    }

    return AuthRoutes.includes(this.$route.name as RouteName);
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url("assets/background.png");
  background-repeat: none;
  background-size: 100vw 100vh;
}

.page-loader {
  height: calc(100% - 64px) !important;
  display: grid;
  place-content: center;
}
</style>
