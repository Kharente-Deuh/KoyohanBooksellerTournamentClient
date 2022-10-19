<template>
  <base-modal v-model="show" :error="error" :persistent="true">
    <template #title> Inscription </template>
    <template #default>
      <v-form ref="form">
        <v-text-field
          label="Adresse e-mail*"
          v-model="data.email"
          :disabled="loading"
          :color="colors.green"
          :rules="[rules.required, rules.email]"
        />
        <v-text-field
          label="Nom/Pseudo*"
          v-model="data.name"
          :disabled="loading"
          :color="colors.green"
          :rules="[rules.required]"
        />
        <v-text-field
          :disabled="loading"
          label="Mot de passe*"
          :append-icon="showData.password ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showData.password ? 'text' : 'password'"
          v-model="data.password"
          :color="colors.green"
          :rules="[rules.required, rules.security, arePwdAndConfirmationSame]"
          @click:append="showData.password = !showData.password"
        />
        <v-text-field
          :disabled="loading"
          label="Confirmation*"
          :append-icon="
            showData.passwordConfirmation ? 'mdi-eye-off' : 'mdi-eye'
          "
          :type="showData.passwordConfirmation ? 'text' : 'password'"
          v-model="data.passwordConfirmation"
          :color="colors.green"
          :rules="[rules.required, arePwdAndConfirmationSame]"
          @click:append="
            showData.passwordConfirmation = !showData.passwordConfirmation
          "
        />
        <recaptcha :token.sync="captchaToken" />
      </v-form>
    </template>
    <template #actions>
      <form-actions
        primaryText="Confirmer"
        secondaryText="Annuler"
        primaryId="registerButton"
        secondaryId="cancelButton"
        :isOk="isFormComplete"
        :loading="loading"
        @primaryAction="primaryAction"
        @secondaryAction="show = false"
      />
    </template>
  </base-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { isEmail, isStrongPassword } from "validator";

import { colors } from "@/utils/constants";
import { VForm } from "@/global.types";
import { AuthService } from "@/services/apiService";

import BaseModal from "@/components/common/base.modal.vue";
import FormActions from "@/components/common/form.actions.vue";
import Recaptcha from "@/components/common/Recaptcha.vue";
import { RegisterPayload } from "@/services/apiService/types";

const components = {
  BaseModal,
  FormActions,
  Recaptcha,
};

const Store = {
  AlertModule: namespace("alert"),
};

@Component({ name: "register", components })
export default class Register extends Vue {
  @Prop({ required: true, type: Boolean })
  readonly value: boolean;

  @Store.AlertModule.Mutation
  readonly ALERT_SUCCESS: (message: string) => void;

  readonly colors = colors;
  readonly authService = new AuthService();

  loading = false;
  error = "";

  captchaToken = "";
  data = {
    email: "",
    name: "",
    password: "",
    passwordConfirmation: "",
  };

  showData = {
    password: false,
    passwordConfirmation: false,
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
    if (this.data.password === this.data.passwordConfirmation) {
      return true;
    }

    return "Votre nouveau mot de passe doit être le même que la confirmation";
  }

  get isFormComplete(): boolean {
    return (
      isEmail(this.data.email) &&
      this.data.name.length > 0 &&
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
    this.data.email = "";
    this.data.name = "";
    this.data.password = "";
    this.data.passwordConfirmation = "";
    this.form().resetValidation();
    this.loading = false;
  }

  async primaryAction(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      const { passwordConfirmation, ...payloadData } = this.data;
      const payload: RegisterPayload = {
        ...payloadData,
        recaptcha: this.captchaToken as string,
      }
      
      await this.authService.register(payload);
      this.ALERT_SUCCESS(
        "Inscription réussie ! Un e-email d'activation vous a été envoyé."
      );
      this.show = false;
    } catch (error: any) {
      this.resetData();
      this.handleError(error.response?.status);
    }
  }

  handleError(errorCode?: number | undefined): void {
    if (!errorCode) {
      this.error = "La requête a échoué";
      return;
    }

    switch (errorCode) {
      case 409:
        this.error = "Un compte lié à cette adresse e-mail existe déjà";
        return;
      default:
        this.error = "La requête a échoué";
        return;
    }
  }

  get show(): boolean {
    return this.value;
  }

  set show(value: boolean) {
    this.$emit("input", value);
    this.error = "";
    this.captchaToken = "";
    this.resetData();
  }
}
</script>