<template>
  <v-container class="leaderboardContainer">
    <v-row id="selectionButtonsHeader">
      <v-col cols="6">
        <v-btn
          :color="mode === UserType.LIBRARIAN ? colors.green : colors.red"
          :text="mode === UserType.LIBRARIAN"
          :class="mode === UserType.LIBRARIAN ? 'activeMode' : ''"
          @click="mode = UserType.LIBRARIAN"
        >
          TOURNOI DES LIBRAIRES
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          :color="mode === UserType.CUSTOMER ? colors.green : colors.red"
          :text="mode === UserType.CUSTOMER"
          :class="mode === UserType.CUSTOMER ? 'activeMode' : ''"
          @click="mode = UserType.CUSTOMER"
        >
          TOURNOI DES LECTEURS
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="mode === UserType.LIBRARIAN" justify="center" class="totoRow">
      <v-col cols="6" style="padding: 50px">
        <img
          style="max-width: 100; max-height: 400px"
          src="@/assets/gloves.png"
        />
      </v-col>
      <v-col cols="6" class="desicriptionCol">
        <p class="descriptionText mb-0">
          <span class="descriptionTitle"> Date de début: </span>
          {{ startDate }}
        </p>
        <p class="descriptionText">
          <span class="descriptionTitle"> Date de fin: </span>
          {{ endDate }}
        </p>
        <br />
        <p class="descriptionText">
          Pour ce tournoi, les trois premiers libraires du classement pourront
          gagner des lots:
        </p>
        <p class="descriptionText">
          <span style="font-wieght: bold; color: #ffd700"> #1 </span>
          <br />
          - Une paire de
          <span style="font-wieght: bold; color: #74bb85">
            Gants de boxe dédicacée
          </span>
          par l'auteur.
          <br />
          -
          <span style="font-wieght: bold; color: #74bb85"> 10 </span>
          exemplaires du tome 1
          <span style="font-wieght: bold; color: #74bb85"> dédicacés </span>
          par l'auteur
        </p>

        <p class="descriptionText">
          <span style="font-wieght: bold; color: #c0c0c0"> #2 </span>
          <br />
          - Une paire de
          <span style="font-wieght: bold; color: #74bb85">
            Gants de boxe dédicacée
          </span>
          par l'auteur.
          <br />
          -
          <span style="font-wieght: bold; color: #74bb85"> 5 </span>
          exemplaires du tome 1
          <span style="font-wieght: bold; color: #74bb85"> dédicacés </span>
          par l'auteur
        </p>

        <p class="descriptionText">
          <span style="font-wieght: bold; color: #cd7f32"> #3 </span>
          <br />
          -
          <span style="font-wieght: bold; color: #74bb85"> 5 </span>
          exemplaires du tome 1
          <span style="font-wieght: bold; color: #74bb85"> dédicacés </span>
          par l'auteur
        </p>

        <p class="descriptionText">
          Nous contacterons les gagnants par e-mail après la fin de l'événement
          <span style="font-wieght: bold; color: #74bb85">
            ({{ formatDate(eventEnd) }})
          </span>
          <br />
          Alors surveillez le classement et votre boîte mail !
        </p>
      </v-col>
    </v-row>
    <v-row v-else justify="center" class="totoRow">
      <v-col cols="6" style="padding: 50px">
        <img class="tomeCover" src="@/assets/tome.png" />
      </v-col>
      <v-col cols="6" class="desicriptionCol">
        <p class="descriptionText mb-0">
          <span class="descriptionTitle"> Date de début: </span>
          {{ startDate }}
        </p>
        <p class="descriptionText">
          <span class="descriptionTitle"> Date de fin: </span>
          {{ endDate }}
        </p>
        <br />
        <p class="descriptionText">
          Pour ce tournoi, chaque lecteur qui se placera dans les
          <span style="font-wieght: bold; color: #ffd700">
            10 premières places
          </span>
          du classement recevra
          <span style="font-wieght: bold; color: #74bb85"> un exemplaire </span>
          du tome 1
          <span style="font-wieght: bold; color: #74bb85"> dédicacé </span>
          par l'auteur !
        </p>
        <p class="descriptionText">
          Nous contacterons les gagnants par e-mail après la fin de l'événement
          <span style="font-wieght: bold; color: #74bb85">
            ({{ formatDate(eventEnd) }})
          </span>
          <br />
          Alors surveillez le classement et votre boîte mail !
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";

import userFetcher from "@/utils/userFetcher";
import {
  colors,
  customerStart,
  librarianStart,
  eventEnd,
} from "@/utils/constants";
import { UserType } from "@/services/apiService/types";

Component.registerHooks(["beforeRouteEnter"]);
@Component({ name: "rewards" })
export default class Rewards extends Vue {
  beforeRouteEnter(
    to: Route,
    from: Route,
    next: (location?: Location) => void
  ): void {
    userFetcher(to, from, next);
  }

  readonly colors = colors;
  readonly UserType = UserType;
  mode: UserType = UserType.LIBRARIAN;
  readonly eventEnd = eventEnd;

  get startDate(): string {
    return this.formatDate(
      this.mode === UserType.LIBRARIAN
        ? new Date(librarianStart)
        : customerStart
    );
  }

  get endDate(): string {
    return this.formatDate(
      this.mode === UserType.LIBRARIAN ? customerStart : eventEnd
    );
  }

  formatDate(date: Date): string {
    return (
      date.getDate() +
      " / " +
      (date.getMonth() + 1) +
      " / " +
      date.getFullYear()
    );
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

.activeMode {
  border: solid 1px;
  border-color: #74bb85;
}


#selectionButtonsHeader {
  margin-top: 8px;
  margin-bottom: 8px;
}

.totoRow {
  max-height: calc(100% - 200px);
}

.descriptionText {
  color: white;
}

.descriptionTitle {
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}

.desicriptionCol {
  text-align: left;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  border: 1px solid red;
  padding-left: 20px;
  padding-top: 50px;
  padding-bottom: 50px;
  padding-right: 20px;
}

.tomeCover {
  max-height: 400px;
  border-radius: 5px;
  border: 1px solid #74bb85;
}
</style>