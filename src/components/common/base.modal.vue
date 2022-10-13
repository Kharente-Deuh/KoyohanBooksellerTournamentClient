<template>
  <v-dialog width="400px" :persistent="persistent" v-model="show">
    <v-card flat outlined class="baseDialogCard overflow-hidden">
      <v-card-title
        style="
          margin-bottom: 8px;
          padding-left: 0px;
          padding-right: 0px;
          font-weight: bold;
        "
      >
        <slot name="title" />
        <v-spacer />
        <v-icon @click.stop="close()" :color="colors.red">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="cardText">
        <slot name="customAlert" />
        <v-alert v-if="error?.length" outlined color="red" text type="error">
          {{ error }}
          <slot name="error" />
        </v-alert>
        <slot />
      </v-card-text>
      <v-card-actions class="justify-center">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { colors } from "@/utils/constants";

@Component({ name: "base-modal" })
export default class BaseModal extends Vue {
  @Prop({ type: Boolean, required: true })
  readonly value: boolean;

  @Prop({ type: String, default: "" })
  readonly error: string;

  @Prop({ type: Boolean, default: false })
  readonly persistent: boolean;

  readonly colors = colors;

  get show(): boolean {
    return this.value;
  }

  set show(value: boolean) {
    this.$emit("input", value);
  }

  close(): void {
    this.show = false;
  }
}
</script>
<style>
.alertError {
  margin: 16px !important;
}

.cardText {
  padding: 0px;
  margin-bottom: 16px;
}

.baseDialogCard {
  padding-left: 24px;
  padding-right: 24px;
}
</style>