<template>
  <auth-form
    :error="error"
    :success="success"
    :loading="loading"
    :isFormComplete="true"
    :showActionButton="false"
  >
    <template #title>Activation du compte</template>
  </auth-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AuthForm from "@/components/common/AuthForm.vue";
import { colors } from "@/utils/constants";
import * as firebaseService from "@/services/firebase.service";

@Component({ name: "activation", components: { AuthForm } })
export default class Activation extends Vue {
  readonly colors = colors;
  loading = false;
  error = "";
  success = "";

  created(): void {
    this.callActivate();
  }

  async callActivate(): Promise<void> {
    this.loading = true;
    this.error = "";
    this.success = "";

    try {
      await firebaseService.verifyEmail(this.$route.params.hash);
      this.success = "Compte activé avec succès. Vous pouvez maintenant vous connecter";
    } catch (error) {
      this.error = "Lien d'activation invalide/expiré";
    }

    this.loading = false;
  }
}
</script>