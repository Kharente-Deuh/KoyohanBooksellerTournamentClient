<template>
  <v-container fill-height justify="center">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <p class="text">
          <span class="titleText">Koyohan - The Boxer</span>
          <br />
          <span class="gameText">LE JEU</span>
        </p>
      </v-col>

      <v-col cols="12">
        <timer :date="librarianStart" @onFinish="startEvent" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { librarianStart } from "@/utils/constants";
import { RouteName } from "@/router/types";

import Timer from "@/components/timer.vue";

@Component({ name: "home", components: { Timer } })
export default class Home extends Vue {
  readonly librarianStart: string = librarianStart;

  startEvent(): void {
    this.$router.push({ name: RouteName.GAME });
  }
}
</script>

<style>
.leaderboardContainer {
  padding-left: 0 !important;
  padding-right: 0 !important;
  max-height: calc(100% - 70px) !important;
  height: calc(100% - 70px) !important;
}

.leaderboardTable {
  border: 3px solid transparent !important;
  border-image: linear-gradient(to right, #e11f1c, #74bb85) !important;
  border-image-slice: 1 !important;
}

.activeMode {
  border: solid 1px;
  border-color: #74bb85;
}

.membersRow {
  height: 700px !important;
  max-height: 700px !important;
  margin: 0px !important;
  /* background: white; */
  border: 1px solid transparent !important;
  border-image: linear-gradient(to right, #e11f1c, #74bb85) !important;
  border-image-slice: 1 !important;
}

#selectionButtonsHeader {
  margin-top: 8px;
  margin-bottom: 8px;
}

.text {
  font-weight: bold;
  color: white;
}

.titleText {
  font-size: 400%;
}

.gameText {
  text-transform: uppercase;
  font-size: 200%;
}
</style>