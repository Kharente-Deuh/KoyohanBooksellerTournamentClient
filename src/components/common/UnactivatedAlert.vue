<template>
  <v-alert outlined color="red" type="error">
    <v-row align="center">
      <v-col class="grow">
        <p>
          Votre compte n'est pas activé. Veuillez vérifier si votre boîte mail
          contient le mail d'activation.
        </p>
        <v-btn v-if="!disabled" @click="resendEmail" :color="colors.green">
          Renvoyer l'e-mail
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { colors } from "@/utils/constants";
import { RouteName } from "@/router/types";


@Component({ name: "unactivated-alert" })
export default class AuthForm extends Vue {
  @Prop({ required: true, type: Boolean })
  readonly disabled: boolean;

  readonly colors = colors

  resendEmail(): void {
    this.$router.push({ name: RouteName.SEND_ACTIVATION });
  }
}
</script>