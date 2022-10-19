<template>
  <div ref="captcha" class="vue-friendly-captcha frc-captcha captcha" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { WidgetInstance } from "friendly-challenge";

@Component({ name: "recaptcha" })
export default class Recaptcha extends Vue {
  @Prop({ type: String, required: true })
  readonly token: string | null;

  @Prop({ type: Boolean, default: false })
  readonly resetCaptcha: boolean;

  widget: WidgetInstance | null;
  mounted(): void {
    if (this.widget) {
      return
    }

    console.log(this.$refs.captcha)
    console.log(this.$refs)
    this.widget = new WidgetInstance(this.$refs.captcha as HTMLElement, {
        sitekey: "FCMLAO0AGQ4P62EM",
        startMode: "focus",
        language: "fr",
        errorCallback: this.onTokenExpired.bind(this),
        doneCallback: this.updateToken.bind(this),
        solutionFieldName: "frc-captcha-solution",
        puzzleEndpoint: "https://api.friendlycaptcha.com/api/v1/puzzle",
      });
  }

  destroy(): void {
    if (this.widget) {
      this.widget.destroy()
      this.$emit("update:resetCaptcha", false)
    }
  }

  @Watch('resetCaptcha')
  onResetCaptchaChange(val: boolean): void {
    if (!val) {
      return
    }

    this.widget?.reset()
  }

  onTokenExpired(): void {
    this.updateToken("");
  }

  updateToken(token: string): void {
    this.$emit("update:token", token);
  }
}
</script>
<style>
.captcha {
  max-width: 100% !important;
}
</style>