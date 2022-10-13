<template>
  <v-card-actions v-if="!loading" class="actionStylished">
    <action
      v-if="secondaryText"
      @click="secondaryAction"
      :text="secondaryText"
      :isPrimary="false"
      :disabled="deletionForm && !isOk"
      :id="secondaryId"
      :color="colors.green"
    />
    <action
      @click="primaryAction"
      :text="primaryText"
      :disabled="!deletionForm && !isOk"
      :id="primaryId"
      :color="colors.green"
    />
  </v-card-actions>
  <v-card-actions class="actionStylished" v-else>
    <v-progress-circular indeterminate :color="colors.red" />
  </v-card-actions>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { colors } from "@/utils/constants";
import Action from "@/components/common/action.vue";

@Component({ name: "form-actions", components: { Action } })
export default class FormActions extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly loading: boolean;

  @Prop({ type: Boolean, default: true })
  readonly marginBottom: boolean;

  @Prop({ required: true, type: String })
  readonly primaryText: string;

  @Prop({ required: true, type: String })
  readonly primaryId: string;

  @Prop({ required: true, type: String })
  readonly secondaryText: string;

  @Prop({ required: true, type: String })
  readonly secondaryId: string;

  @Prop({ type: Boolean, default: true })
  readonly isOk: boolean;

  @Prop({ type: Boolean, default: false })
  readonly deletionForm: boolean;

  readonly colors = colors;

  primaryAction(): void {
    this.$emit("primaryAction");
  }

  secondaryAction(): void {
    this.$emit("secondaryAction");
  }
}
</script>
<style>
.actionStylished {
  justify-content: center !important;
}
</style>