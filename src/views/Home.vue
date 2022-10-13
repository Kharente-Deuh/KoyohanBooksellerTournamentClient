<template>
  <v-container fill-height justify="center">
    <v-row align="center" justify="center">
      <timer :date="librarianStart" @onFinish="startEvent" />
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