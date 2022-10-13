<template>
  <v-container fill-height justify="center">
    <v-row align="center" justify="center">
      <div>
        <v-img
          src="@/assets/logo_horizontal_light.png"
          :max-width="width"
          :max-height="imageHeight"
          style="margin-bottom: 16px"
        />
        <v-card flat outlined :style="`width:${width}px`" class="authForm">
          <v-card-title
            style="
              margin-bottom: 8px;
              padding-left: 0px;
              padding-right: 0px;
              font-weight: bold;
            "
          >
            <slot name="title" />
          </v-card-title>
          <v-card-text class="cardText">
            <slot name="customAlert" />
            <v-alert
              v-if="error?.length"
              outlined
              color="red"
              text
              type="error"
            >
              {{ error }}
              <slot name="error" />
            </v-alert>
            <v-alert
              v-if="success?.length"
              outlined
              color="green"
              text
              type="success"
            >
              {{ success }}
            </v-alert>
            <slot v-if="success.length === 0" />
          </v-card-text>
          <v-card-actions
            v-if="showActionButton && success.length === 0"
            class="justify-center"
          >
            <v-btn
              v-if="!loading"
              style="width: 100%"
              :color="colors.green"
              :dark="isFormComplete"
              :disabled="!isFormComplete"
              @click="primaryAction"
            >
              Continuer
            </v-btn>
            <v-progress-circular v-else indeterminate :color="colors.green" />
          </v-card-actions>
        </v-card>
      </div>
      <div class="subactionsDiv">
        <div class="subactionText" @click="goToGame">RETOUR AU SITE</div>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { colors } from "@/utils/constants";
import { RouteName } from "@/router/types";

@Component({ name: "auth-form" })
export default class AuthForm extends Vue {
  @Prop({ required: false, type: Boolean, default: true })
  readonly showActionButton;

  @Prop({ required: false, type: String, default: "" })
  readonly error;

  @Prop({ required: false, type: String, default: "" })
  readonly success;

  @Prop({ required: true, type: Boolean })
  readonly loading;

  @Prop({ required: true, type: Boolean })
  readonly isFormComplete;

  readonly colors = colors;

  goToGame(): void {
    this.$router.push({ name: RouteName.GAME });
  }

  get width(): number {
    return this.$vuetify.breakpoint.xs ? 320 : 400;
  }

  get imageHeight(): number {
    return this.$vuetify.breakpoint.xs ? 60 : 75;
  }

  primaryAction(): void {
    this.$emit("primaryAction");
  }
}
</script>

<style scoped>
.authForm {
  max-width: 600px;
  padding-left: 24px;
  padding-bottom: 24px;
  padding-right: 24px;
}

.cardText {
  padding: 0px;
  margin-bottom: 16px;
}

.subactionsDiv {
  margin-top: 16px;
  width: 100%;
  color: white;
  text-align: center;
}

.subactionText {
  cursor: pointer;
  display: inline;
  font-weight: bold;
}
</style>
