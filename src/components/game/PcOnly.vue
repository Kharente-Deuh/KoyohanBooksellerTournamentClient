<template>
  <v-card flat outlined :style="`width:${width}px;`" :color="colors.black">
      <v-alert outlined color="red" text type="error" style="margin: 0 !important">
        <p>Hélas, le jeu n'est uniquement disponible sur PC.</p>
        Pas de panique, il reste encore du temps pour que vous tentiez votre chance.
      </v-alert>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { colors } from "@/utils/constants";

@Component({ name: "pc-only" })
export default class PcOnly extends Vue {
  readonly colors = colors;

  get width(): number {
    return this.$vuetify.breakpoint.xs ? 320 : 400;
  }
}
</script>

<style>
.v-card__text {
  padding: 0 !important
}
</style>
