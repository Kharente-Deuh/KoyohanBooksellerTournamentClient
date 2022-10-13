<template>
  <auth-form
    :error="error"
    :success="success"
    :loading="loading"
    :isFormComplete="isFormComplete"
    :showActionButton="!showResendActivationEmail"
    @primaryAction="sendActivation"
  >
    <template #title>Mot de passe oublié</template>
    <template #customAlert v-if="showResendActivationEmail">
      <unactivated-alert :disabled="loading" />
    </template>
    <template #default v-if="!showResendActivationEmail">
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
import { SendResetPasswordPayload } from "@/services/apiService/types";

import AuthForm from "@/components/common/AuthForm.vue";
import Recaptcha from "@/components/common/Recaptcha.vue";
import UnactivatedAlert from "@/components/common/UnactivatedAlert.vue";

const components = { AuthForm, Recaptcha, UnactivatedAlert }

@Component({ name: "sendActivation", components })
export default class SendResetPassword extends Vue {
  readonly authService = new AuthService();
  readonly colors = colors;

  showResendActivationEmail = false;
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
    this.showResendActivationEmail = false;
    this.error = "";
    this.success = "";
    this.loading = true;
    try {
      const payload: SendResetPasswordPayload = {
        recaptcha: this.captchaToken,
        email: this.data.email,
      };

      await this.authService.sendResetPassword(payload);
      this.success = "Un email de réinitialisation de mot de passe vous a été envoyé";
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
      case 403:
        this.showResendActivationEmail = true;
        return;
      default:
        this.error = "La requête a échoué";
        return;
    }
  }
}
</script>