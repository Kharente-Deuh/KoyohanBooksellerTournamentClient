<template>
  <v-btn
    :dark="!disabled"
    @click="click"
    :style="customStyle"
    small
    :text="!isPrimary"
    :class="classes"
    :disabled="disabled"
    :color="color"
  >
    {{ text }}
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { colors } from "@/utils/constants";

@Component({ name: "action" })
export default class Action extends Vue {
  @Prop({ required: false, type: Boolean, default: true })
  readonly isPrimary: boolean;

  @Prop({ required: true, type: String })
  readonly text: string;

  @Prop({ type: String, default: colors.red })
  readonly color: string;

  @Prop({ type: String, default: "" })
  readonly customStyle: string;

  @Prop({ type: Boolean, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, default: false })
  readonly keepCase: boolean;

  @Prop({ type: Boolean, default: false })
  readonly rounded: boolean;

  get selectedColor(): string {
    return this.disabled ? "grey darken-1" : this.color;
  }

  get classes(): string {
    const classes: string[] = [];

    if (this.rounded) {
      classes.push("roundButton");
    }

    if (this.keepCase) {
      classes.push("keepCase");
    }

    if (!this.isPrimary) {
      classes.push("solidButton");
    }

    return classes.join(" ");
  }

  click(): void {
    this.$emit("click");
  }
}
</script>

<style scoped>
.keepCase {
  text-transform: none !important;
}

.roundButton {
  border-radius: 15px;
}

.solidButton {
  border: solid 1px;
  border-color: #ff5722;
}
</style>