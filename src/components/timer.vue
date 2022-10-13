<template>
  <div class="countdown">
    <div v-if="days" class="countdown__block">
      <div class="countdown__digit">{{ twoDigits(days) }}</div>
      <div class="countdown__text">J</div>
    </div>
    <div class="countdown__block">
      <div class="countdown__digit">{{ twoDigits(hours) }}</div>
      <div class="countdown__text">Hrs</div>
    </div>
    <div class="countdown__block">
      <div class="countdown__digit">{{ twoDigits(minutes) }}</div>
      <div class="countdown__text">Min</div>
    </div>
    <div class="countdown__block">
      <div class="countdown__digit">{{ twoDigits(seconds) }}</div>
      <div class="countdown__text">Sec</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({ name: "timer" })
export default class Timer extends Vue {
  @Prop({ type: String, required: true })
  readonly date: string;

  now = Math.trunc(new Date().getTime() / 1000);
  event = new Date()
  finish = false;

  mounted(): void {
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
      if (!this.finish && this.calculatedDate - this.now <= 0) {
        this.finish = true;
        this.$emit("onFinish");
      }
    }, 1000);
  }

  get calculatedDate(): number {
    return Math.trunc(Date.parse(this.date) / 1000);
  }

  get secondCount(): number {
    return this.calculatedDate - this.now;
  }

  get seconds(): number {
    if (this.secondCount < 0) return 0;
    return this.secondCount % 60;
  }

  get minutes(): number {
    if (this.secondCount < 0) return 0;
    return Math.trunc(this.secondCount / 60) % 60;
  }

  get hours(): number {
    if (this.secondCount < 0) return 0;
    return Math.trunc(this.secondCount / 60 / 60) % 24;
  }

  get days(): number {
    if (this.secondCount < 0) return 0;
    return Math.trunc(this.secondCount / 60 / 60 / 24);
  }

  twoDigits(value: number): string {
    if (value.toString().length <= 1) {
      return "0" + value.toString();
    }

    return value.toString();
  }
}
</script>

<style lang="scss">
.countdown {
  display: flex;
  justify-content: center;
  &__block {
    text-align: center;
    padding: 0px 15px;
    position: relative;
    &:first-child {
      padding-left: 0;
      .countdown__digit {
        &:before {
          display: none;
        }
      }
    }
    &:last-child {
      padding-right: 0;
    }
  }
  &__text {
    color: white;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  &__digit {
    color: white;
    font-size: 500%;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 5px;
    &:before {
      content: ":";
      position: absolute;
      left: -10px;
    }
  }
}
</style>