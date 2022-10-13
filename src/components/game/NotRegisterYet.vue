<template>
  <base-modal v-model="show" :persistent="true">
    <template #title> Inscription </template>
    <template #default>
    <p> Un peu de patience !</p>
    Les inscriptions pour les lecteurs commenceront le <span style="font-wieght: bold; color: green;">{{ activationDate }}</span>
    <br>
    </template>
    <template #actions>
      <action
        @click="show = false"
        text="Fermer"
        :isPrimary="true"
        :color="colors.red"
      />
    </template>
  </base-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { colors, customerStart } from "@/utils/constants";
import BaseModal from "@/components/common/base.modal.vue";
import Action from "@/components/common/action.vue";

const components = {
  BaseModal,
  Action
};

@Component({ name: "not-register-yet", components })
export default class NotRegisterYet extends Vue {
  @Prop({ required: true, type: Boolean })
  readonly value: boolean;

  readonly colors = colors;

  get activationDate(): string {
    return customerStart.getDate() + '/' + (customerStart.getMonth() + 1)
  }

    get show(): boolean {
    return this.value;
  }

  set show(value: boolean) {
    this.$emit("input", value);
  }
}
</script>