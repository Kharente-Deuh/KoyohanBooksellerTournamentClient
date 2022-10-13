<template>
  <v-app-bar :color="colors.black" flat dark>
    <img
      v-if="isMobile"
      class="navbar-logo"
      src="@/assets/logo_square.png"
      alt="Accueil"
      @click.stop="goToGame"
    />
    <img
      v-else
      class="navbar-logo"
      src="@/assets/logo_horizontal_dark.png"
      alt="Accueil"
      @click.stop="goToGame"
    />
    <nav-bar-tabs />
    <v-icon v-if="user !== null" :color="colors.red" @click.stop="logout">
      mdi-power
    </v-icon>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { colors } from "@/utils/constants";
import { RouteName } from "@/router/types";
import { User } from "@/services/apiService/types";
import { logout } from "@/services/firebase.service";

import NavBarTabs from "@/components/NavBar/navbar.tabs.vue";

const components = {
  NavBarTabs,
};

const Store = {
  UserModule: namespace("user"),
};

@Component({ name: "nav-bar", components })
export default class NavBar extends Vue {
  readonly colors = colors;
  readonly logout = logout;
  readonly RouteName = RouteName;

  get currentRouteName(): string {
    return this.$route.name as string;
  }

  goToGame(): void {
    this.$router.push({ name: RouteName.GAME });
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.smAndDown;
  }

  @Store.UserModule.State
  readonly user: User | null;
}
</script>

<style>
.navbar-logo {
  max-height: 32px;
  cursor: pointer;
}
</style>