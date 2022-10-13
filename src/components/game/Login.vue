<template>
  <base-modal v-model="show" :error="error" :persistent="true">
    <template #title> Connexion </template>
    <template #customAlert v-if="showResendActivationEmail">
      <unactivated-alert :disabled="loading" />
    </template>
    <template #default v-if="!showResendActivationEmail">
      <v-form ref="form">
        <v-text-field
          label="Adresse e-mail*"
          v-model="data.email"
          :disabled="loading"
          :color="colors.green"
          :rules="[rules.required, rules.email]"
        />
        <v-text-field
          :disabled="loading"
          label="Mot de passe*"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          v-model="data.password"
          :color="colors.green"
          :rules="[rules.required]"
          @click:append="showPassword = !showPassword"
        />
        <recaptcha :token.sync="captchaToken" />
      </v-form>
    </template>
    <template #actions v-if="!showResendActivationEmail">
      <v-container justify="center">
        <v-row align="center" justify="center">
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
        </v-row>
        <v-row align="center" justify="center">
          <v-btn x-small @click="forgetPassword"> mot de passe oublié</v-btn>
        </v-row>
      </v-container>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { isEmail } from "validator";

import { colors } from "@/utils/constants";
import { VForm } from "@/global.types";
import { AuthService } from "@/services/apiService";
import { RouteName } from "@/router/types";

import BaseModal from "@/components/common/base.modal.vue";
import FormActions from "@/components/common/form.actions.vue";
import Recaptcha from "@/components/common/Recaptcha.vue";
import UnactivatedAlert from "@/components/common/UnactivatedAlert.vue";

const components = {
  BaseModal,
  FormActions,
  Recaptcha,
  UnactivatedAlert,
};

const Store = {
  AlertModule: namespace("alert"),
  UserModule: namespace("user"),
};

@Component({ name: "login", components })
export default class Login extends Vue {
  @Prop({ required: true, type: Boolean })
  readonly value: boolean;

  @Store.AlertModule.Mutation
  readonly ALERT_SUCCESS: (message: string) => void;

  @Store.AlertModule.Mutation
  readonly ALERT_ERROR: (message: string) => void;

  @Store.UserModule.Action
  readonly fetchCurrentUser: () => Promise<void>;

  readonly colors = colors;
  readonly authService = new AuthService();

  captchaToken = "";
  showResendActivationEmail = false;
  loading = false;
  error = "";

  showPassword = false;
  data = {
    email: "",
    password: "",
  };

  readonly rules = {
    required: (value: string): boolean | string =>
      !!value || "Ce champ est obligatoire",
    email: (value: string): boolean | string =>
      isEmail(value) || "Adresse email invalide",
  };

  get isFormComplete(): boolean {
    return (
      isEmail(this.data.email) &&
      this.data.password.length > 0 &&
      this.captchaToken.length > 0
    );
  }

  form(): VForm {
    return this.$refs.form as VForm;
  }

  resetData(): void {
    this.data.email = "";
    this.data.password = "";
    this.form().resetValidation();
    this.loading = false;
  }

  async primaryAction(): Promise<void> {
    this.showResendActivationEmail = false;
    this.error = "";
    this.loading = true;

    try {
      await this.authService.login({
        ...this.data,
        recaptcha: this.captchaToken as string,
      });
      
      await this.fetchCurrentUser();
      this.ALERT_SUCCESS("Connexion réussie !");
      this.show = false;
    } catch (error: any) {
      console.log(error);
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
      case 400:
        this.error = "Email/Mot de passe incorrect";
        return;
      case 403:
        this.showResendActivationEmail = true;
        return;
      default:
        this.error = "La requête a échoué";
        return;
    }
  }

  async forgetPassword(): Promise<void> {
    this.$router.push({ name: RouteName.SEND_RESET_PASSWORD });
  }

  get show(): boolean {
    return this.value;
  }

  set show(value: boolean) {
    this.$emit("input", value);
    this.error = "";
    this.showResendActivationEmail = false;
    this.captchaToken = "";
    this.resetData();
  }
}
</script>