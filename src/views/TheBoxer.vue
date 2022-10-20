<template>
  <v-container fill-height justify="center" class="totoContainer">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <span class="announceTitle"> The Boxer - Tome 1 </span>
        <br />
        <span class="announceText">
          {{ tomePresentationText }}
        </span>
      </v-col>
      <v-col cols="6">
        <img class="tomeCover" src="@/assets/tome.jpg" />
        <br />
        <v-btn href="/extrait.pdf" download>Lire un extrait</v-btn>
      </v-col>
      <v-col cols="6" class="desicriptionCol">
        <p class="descriptionText">
          K est un entraîneur légendaire qui a révélé cinq champions du monde !
        </p>
        <p class="descriptionText">
          Il parcourt désormais le monde, à la recherche d’un boxeur de génie
          qui deviendra son ultime apprenti.
        </p>
        <p class="descriptionText">
          Alors qu’il pense l’avoir trouvé dans un club de boxe de Séoul, son
          regard se pose sur un jeune garçon qui se fait rouer de coups par un
          groupe de jeunes Celui-ci demeure stoïque. Il ne le sait pas encore
          mais K, lui, l’a déjà compris. Ce jeune garçon possède un talent
          fabuleux…
        </p>
        <br />
        <p class="descriptionText mb-0">
          <span class="descriptionTitle"> Date de parution: </span>
          03/11/2022
        </p>
        <p class="descriptionText mb-0">
          <span class="descriptionTitle"> Prix: </span>
          14,90€
        </p>
        <p class="descriptionText mb-0">
          <span class="descriptionTitle"> Nombe de pages: </span>
          232
        </p>
        <p class="descriptionText mb-0">
          <span class="descriptionTitle"> ISBN: </span>
          2491290707
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { customerStart } from "@/utils/constants";
import { Route } from "vue-router";

import userFetcher from "@/utils/userFetcher";

Component.registerHooks(["beforeRouteEnter"]);
@Component({ name: "the-boxer" })
export default class TheBoxer extends Vue {
  beforeRouteEnter(
    to: Route,
    from: Route,
    next: (location?: Location) => void
  ): void {
    userFetcher(to, from, next);
  }

  get tomePresentationText(): string {
    if (this.availabilityDate === null) {
      return "Déjà disponible chez votre libraire !";
    }

    return `Disponible le ${this.availabilityDate} !`;
  }

  get availabilityDate(): string | null {
    if (new Date() > customerStart) {
      return null;
    }

    return this.formatDate(customerStart);
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
.announceTitle {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 400%;
  color: white;
}

.announceText {
  font-weight: bold;
  font-size: 200%;
  color: white;
}

.descriptionText {
  color: white;
}

.descriptionTitle {
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}

.totoContainer {
  height: calc(100% - 64px) !important;
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