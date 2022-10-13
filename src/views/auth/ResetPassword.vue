<template>
  <auth-form
    :error="error"
    :success="success"
    :loading="loading"
    :isFormComplete="isFormComplete"
    @primaryAction="callResetPassword"
  >
    <template #title>Réinitialisation de mot de passe</template>
    <template #default>
      <v-form ref="form">
        <v-text-field
          :disabled="loading"
          label="Mot de passe*"
          :append-icon="show.password ? 'mdi-eye-off' : 'mdi-eye'"
          :type="show.password ? 'text' : 'password'"
          v-model="data.password"
          :color="colors.green"
          :rules="[rules.required, rules.security, arePwdAndConfirmationSame]"
          @click:append="show.password = !show.password"
          id="passwordField"
        />
        <v-text-field
          :disabled="loading"
          label="Confirmation*"
          :append-icon="show.passwordConfirmation ? 'mdi-eye-off' : 'mdi-eye'"
          :type="show.passwordConfirmation ? 'text' : 'password'"
          v-model="data.passwordConfirmation"
          :color="colors.green"
          :rules="[rules.required, arePwdAndConfirmationSame]"
          @click:append="show.passwordConfirmation = !show.passwordConfirmation"
          id="passwordConfirmationField"
        />
        <recaptcha :token.sync="captchaToken" />
      </v-form>
    </template>
  </auth-form>
</template>
<script lang="ts">
import { colors } from "@/utils/constants";
import { Component, Vue } from "vue-property-decorator";
import { isEmail, isStrongPassword } from "validator";

import { VForm } from "@/global.types";
import { ResetPasswordPayload } from "@/services/apiService/types";
import { AuthService } from "@/services/apiService";

import AuthForm from "@/components/common/AuthForm.vue";
import Recaptcha from "@/components/common/Recaptcha.vue";

@Component({ name: "reset-password", components: { AuthForm, Recaptcha } })
export default class ResetPassword extends Vue {
  readonly colors = colors;
  readonly authService = new AuthService();

  loading = false;
  error = "";
  success = "";

  show = {
    password: false,
    passwordConfirmation: false,
  };

  captchaToken = "";
  data = {
    password: "",
    passwordConfirmation: "",
  };

  readonly rules = {
    required: (value: string): boolean | string =>
      !!value || "Ce champ est obligatoire",
    email: (value: string): boolean | string =>
      isEmail(value) || "Adresse email invalide",
    security: (value: string): string | boolean =>
      isStrongPassword(value) ||
      "Votre mot de passe doit contenir au moins 8 caractères, dont 1 majuscule, 1 minuscule, 1 chiffre and 1 caractère spécial",
  };

  get arePwdAndConfirmationSame(): boolean | string {
    return (
      this.data.password === this.data.passwordConfirmation ||
      "Votre nouveau mot de passe doit être le même que la confirmation"
    );
  }

  get isFormComplete(): boolean {
    return (
      this.data.password.length > 0 &&
      isStrongPassword(this.data.password) &&
      this.arePwdAndConfirmationSame === true &&
      this.captchaToken.length > 0
    );
  }

  form(): VForm {
    return this.$refs.form as VForm;
  }

  resetData(): void {
    this.loading = false;
    this.data.password = "";
    this.data.passwordConfirmation = "";
    this.form().resetValidation();
  }

  async callResetPassword(): Promise<void> {
    this.error = "";
    this.success = "";
    this.loading = true;

    try {
      const payload: ResetPasswordPayload = {
        recaptcha: this.captchaToken,
        code: this.$route.params.hash,
        password: this.data.password,
      };

      await this.authService.resetPassword(payload);
      this.success = "Mot de passe réinitialisé avec succès";
    } catch (error: any) {
      console.error(error);
      this.handleError(error.response?.status)
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
        this.error = "Lien de réinitialisation invalide/expiré.";
        return;
      default:
        this.error = "La requête a échoué";
        return;
    }
  }
}
</script>