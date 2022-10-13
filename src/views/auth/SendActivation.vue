<template>
  <auth-form
    :error="error"
    :success="success"
    :loading="loading"
    :isFormComplete="isFormComplete"
    @primaryAction="sendActivation"
  >
    <template #title>Renvoyer l'email d'activation</template>
    <template #default>
      <v-form ref="form">
        <v-text-field
          outlined
          :disabled="loading"
          v-model="data.email"
          :rules="[rules.required, rules.email]"
          :color="colors.green"
          label="email*"
        />
        <recaptcha :token.sync="captchaToken" />
      </v-form>
    </template>
  </auth-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { isEmail } from "validator";

import { colors } from "@/utils/constants";
import { VForm } from "@/global.types";
import { AuthService } from "@/services/apiService";

import AuthForm from "@/components/common/AuthForm.vue";
import Recaptcha from "@/components/common/Recaptcha.vue";
import { SendActivationPayload } from "@/services/apiService/types";

@Component({ name: "sendActivation", components: { AuthForm, Recaptcha } })
export default class SendActivation extends Vue {
  readonly authService = new AuthService();
  readonly colors = colors;

  captchaToken = "";
  loading = false;
  showPassword = false;
  error = "";
  success = "";
  data = { email: "" };

  readonly rules = {
    required: (value: string): string | boolean =>
      !!value || "Champ obligatoire",
    email: (value: string): string | boolean =>
      isEmail(value) || "Adresse e-mail invalide",
  };

  get isFormComplete(): boolean {
    return (
      isEmail(this.data.email) &&
      this.success.length === 0 &&
      this.captchaToken.length > 0
    );
  }

  form(): VForm {
    return this.$refs.form as VForm;
  }

  resetData(): void {
    this.loading = false;
    this.data.email = "";
    this.form().resetValidation();
  }

  async sendActivation(): Promise<void> {
    this.error = "";
    this.success = "";
    this.loading = true;
    try {
      const payload: SendActivationPayload = {
        recaptcha: this.captchaToken,
        email: this.data.email,
      };

      await this.authService.sendActivationEmail(payload);
      this.success = "Un email d'activation vous a été envoyé";
    } catch (error: any) {
      this.handleError(error.response?.status);
    }

    this.resetData();
  }

    handleError(errorCode?: number | undefined): void {
    if (!errorCode) {
      this.error = "La requête a échoué";
      return;
    }

    switch (errorCode) {
      case 400:
        this.error = "Votre compte est déjà activé";
        return;
      default:
        this.error = "La requête a échoué";
        return;
    }
  }
}
</script>