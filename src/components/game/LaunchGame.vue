<template>
  <v-card flat outlined class="authForm">
    <v-card-title
      style="
        margin-bottom: 8px;
        padding-left: 0px;
        padding-right: 0px;
        font-weight: bold;
      "
    >
      Tentez votre chance !
    </v-card-title>
    <v-card-text v-if="loading">
      <v-progress-circular indeterminate :color="colors.green" />
    </v-card-text>
    <v-card-text v-if="!loading && user !== null">
      Vous avez jusqu'au
      <span style="font-weight: bold; color: green">{{ userLimitDate }}</span>
      pour jouer !
      <div v-if="user?.highScore">
        Votre meilleur score est
        <span style="font-weight: bold; color: #e11f1c">{{
          user.highScore.score
        }}</span>
        en
        <span style="font-weight: bold; color: #74bb85">{{
          timeToString(user.highScore.time)
        }}</span>
      </div>
    </v-card-text>

    <v-card-actions v-if="user === null && !loading" class="actionStylished">
      <action
        @click="toggleRegistration"
        text="Inscription"
        :isPrimary="true"
        :color="colors.green"
      />
      <action
        @click="toggleLogin"
        text="Connexion"
        :isPrimary="true"
        :color="colors.red"
      />
    </v-card-actions>
    <v-card-actions v-if="user !== null && !loading" class="actionStylished">
      <action
        v-if="!newHighScore"
        @click="toggleLaunchGame"
        text="Jouer"
        :isPrimary="true"
        :color="colors.green"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { colors, customerStart, eventEnd } from "@/utils/constants";
import { GameScore, User, UserType } from "@/services/apiService/types";
import { isBetter, timeToString } from "@/utils/score.utils";

import Action from "@/components/common/action.vue";

const Store = {
  UserModule: namespace("user"),
};

@Component({ name: "launch-game", components: { Action } })
export default class LaunchGame extends Vue {
  @Prop({ required: true })
  readonly newScore: GameScore | null;

  @Store.UserModule.State
  readonly user: User | null;

  @Store.UserModule.Action
  readonly updateScore: (score: GameScore) => Promise<void>;

  readonly colors = colors;
  readonly timeToString = timeToString;

  loading = false;

  get newHighScore(): boolean {
    if (this.newScore === null) {
      return false;
    }

    if (this.user === null) {
      return true;
    }

    return isBetter(this.newScore, this.user.highScore);
  }

  mounted(): void {
    if (this.newScore !== null) {
      this.callUpdateScore(this.newScore);
    }
  }

  async callUpdateScore(newScore: GameScore): Promise<void> {
    if (this.user === null) {
      return;
    }

    if (new Date() > eventEnd) {
      return;
    }

    if (this.user.type === UserType.LIBRARIAN && new Date() > customerStart) {
      return;
    }

    if (!isBetter(newScore, this.user.highScore)) {
      return;
    }

    this.loading = true;
    await this.updateScore(newScore);
    this.loading = false;
    this.$emit("update:newScore", null);
  }

  toggleRegistration(): void {
    this.$emit("toggleRegistration");
  }

  toggleLogin(): void {
    this.$emit("toggleLogin");
  }

  toggleLaunchGame(): void {
    this.$emit("toggleLaunchGame");
  }

  get userLimitDate(): string {
    if (!this.user) {
      return "";
    }

    const date =
      this.user.type === UserType.LIBRARIAN ? customerStart : eventEnd;
    return date.getDate() + "/" + (date.getMonth() + 1);
  }
}
</script>

<style scoped>
.authForm {
  max-width: 600px;
  padding-left: 24px;
  padding-right: 24px;
}
</style>

<style>
.actionStylished {
  padding-bottom: 34px;
  justify-content: center !important;
}
</style>
