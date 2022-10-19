<template>
  <v-container fill-height class="gameContainer" justify="center">
    <register v-if="showRegisterModal" v-model="showRegisterModal" />
    <not-register-yet v-if="showNotRegisterYetModal" v-model="showNotRegisterYetModal" />
    <login v-if="showLoginModal" v-model="showLoginModal" />
    <v-row align="center" justify="center">
      <pc-only v-if="isMobile" />
      <launch-game
        v-if="!isMobile && !showGameCanvas"
        @toggleRegistration="toggleRegistrationModal"
        @toggleLogin="showLoginModal = true"
        @toggleLaunchGame="showGameCanvas = true"
        :newScore.sync="newScore"
      />
      <div v-if="!isMobile && showGameCanvas" id="canvas" />
    </v-row>
    <request-alert />
  </v-container>
</template>

<script lang="ts">
import P5 from "p5";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { namespace } from "vuex-class";

import { colors, customerStart } from "@/utils/constants";
import { GameScore } from "@/services/apiService/types";
import { startGame } from "@/services/gameService";
import userFetcher from "@/utils/userFetcher";

import Action from "@/components/common/action.vue";
import PcOnly from "@/components/game/PcOnly.vue";
import LaunchGame from "@/components/game/LaunchGame.vue";
import Register from "@/components/game/Register.vue";
import NotRegisterYet from "@/components/game/NotRegisterYet.vue";
import RequestAlert from "@/components/common/RequestAlert.vue";
import Login from "@/components/game/Login.vue";

const components = {
  Action,
  PcOnly,
  LaunchGame,
  Register,
  Login,
  RequestAlert,
  NotRegisterYet
};

const Store = { LoaderModule: namespace("loader") };

Component.registerHooks(["beforeRouteEnter"]);
@Component({ name: "game", components })
export default class Game extends Vue {
  beforeRouteEnter(
    to: Route,
    from: Route,
    next: (location?: Location) => void
  ): void {
    userFetcher(to, from, next);
  }

  @Store.LoaderModule.Mutation
  readonly TOGGLE_PAGE_LOADING: (val: boolean) => void;

  readonly colors = colors;

  game: P5 | null;
  newScore: GameScore | null = null;

  showGameCanvas = false;
  showNotRegisterYetModal = false
  showRegisterModal = false;
  showLoginModal = false;

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.smAndDown;
  }

  @Watch("showGameCanvas")
  onShowGameCanvasChange(val: boolean, oldVal: boolean): void {
    if (oldVal === val) {
      return;
    }

    if (val === false) {
      this.game = null;
    } else {
      this.TOGGLE_PAGE_LOADING(true);
      this.sleep(500).then(() => {
        this.TOGGLE_PAGE_LOADING(false);
        this.game = startGame(780, 580, this.onGameEnd);
      });
    }
  }

  onGameEnd(score: number, time: number): void {
    this.newScore = { score, time };
    this.showGameCanvas = false;
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  toggleRegistrationModal(): void {
    if (new Date() < customerStart) {
      this.showNotRegisterYetModal = true
    } else {
      this.showRegisterModal = true
    }
  }
}
</script>
<style>
.p5Canvas {
  border: 3px solid transparent;
  border-image: linear-gradient(to right, #e11f1c, #74bb85);
  border-image-slice: 1;
}

.gameContainer {
  height: calc(100% - 64px) !important;
}
</style>