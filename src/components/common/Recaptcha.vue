<template>
  <vue-recaptcha ref="recaptcha" class="captcha"
    sitekey="6LfP-3EiAAAAAKlDLTrA8jfkmsoXGYOmvmSdh3cR"
    @verify="updateToken"
    @expired="onTokenExpired"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { VueRecaptcha } from "vue-recaptcha";

@Component({ name: "recaptcha", components: { VueRecaptcha } })
export default class Recaptcha extends Vue {
  @Prop({ type: String, required: true })
  readonly token: string | null;

  onTokenExpired(): void {
    this.updateToken("")
  }

  updateToken(token: string): void {
    this.$emit("update:token", token)
  }
}
</script>
<style>
.captcha {
  width: 100% !important
}
</style>