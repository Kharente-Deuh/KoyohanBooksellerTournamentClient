<template>
  <v-snackbar
    v-model="show"
    :timeout="5000"
    @input="close"
    :color="alertColor"
    bottom
    absolute
    outlined
  >
    {{ requestAlert?.message || "" }}
    <template v-slot:action="{ attrs }">
      <v-btn :color="colors.grey" text icon v-bind="attrs" @click="close">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { colors } from "@/utils/constants";
import { RequestAlert } from "@/global.types";

const Store = { AlertModule: namespace("alert") };

@Component({ name: "request-alert" })
export default class RequestAlertComponent extends Vue {
  @Store.AlertModule.State
  readonly requestAlert?: RequestAlert;

  @Store.AlertModule.Mutation
  readonly RESELT_ALERT_STATES: () => void;

  readonly colors = colors;
  show = false;

  @Watch("requestAlert")
  onRequestAlertChanged(value: boolean): void {
    this.show = !!value;
  }

  close(): void {
    this.RESELT_ALERT_STATES();
  }

  get alertColor(): string {
    return this.requestAlert?.type || "";
  }
}
</script>