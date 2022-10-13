<template>
  <v-card
    :id="cardUuid"
    height="100%"
    max-height="100%"
    width="100%"
    outlined
    tile
    class="card-outter"
    v-resize="onResize"
  >
    <v-card-title :id="cardTitleUuid">
      <v-text-field
        v-model="search"
        :color="colors.green"
        placeholder="Rechercher"
        prepend-inner-icon="mdi-magnify"
        hide-details
      />
    </v-card-title>
    <div ref="resizableDiv">
      <slot
        name="table"
        v-bind:table="{ page, pageCount, pageItems, search, updatePageCount }"
      />
    </div>
    <v-card-actions
      v-if="pageCount > 1"
      class="card-actions text-center"
      style="padding: 0 !important"
    >
      <v-pagination
        v-model="page"
        :length="pageCount"
        :color="colors.red"
        class="my-4"
        circle
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { v4 as uuid } from "uuid";
import { colors } from "@/utils/constants";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({ name: "resizable-table" })
export default class ResizableTable extends Vue {
  @Prop({ type: String, default: null })
  readonly overHeaderId: string | null

  readonly colors = colors;

  cardUuid = uuid();
  cardTitleUuid = uuid();
  search = "";
  pageCount = 1;
  page = 1;
  pageItems = 0;
  actionsHeight = 92;

  emitButtonClicked(): void {
    this.$emit("buttonClicked");
  }

  created(): void {
    this.onResize();
  }

  onResize(): void {
    const occupiedHeight =
      this.getCardHeight() - this.actionsHeight - this.getHeaderHeight() ;
    const rowsPerPage = Math.floor(occupiedHeight / this.getRowHeight());
    this.pageItems = rowsPerPage;
  }

  getCardHeight(): number {
    return this.getHtmlElementHeightById(this.cardUuid) ?? 0;
  }

  getHeaderHeight(): number {
    return this.getHtmlElementHeightById(this.cardTitleUuid) ?? 0;
  }

  getRowHeight(): number {
    return (
      this.getHtmlElementHeightByClass("v-data-table__mobile-table-row") ?? 48
    );
  }

  getOverHeaderHeight(): number {
    if (!this.overHeaderId) {
      return 0
    }

    return this.getHtmlElementHeightById(this.overHeaderId) ?? 0;
  }

  updatePageCount(newCount: number): void {
    this.pageCount = newCount;
  }

  getHtmlElementHeightById(id: string): number | null {
    const element: Element | null = document.getElementById(id);
    if (!element) {
      return null;
    }

    const htmlElement = element as HTMLElement;
    return htmlElement.offsetHeight;
  }

  getHtmlElementHeightByClass(className: string): number | null {
    const element: Element | null | undefined =
      document.getElementsByClassName(className)[0];
    if (!element) {
      return null;
    }

    const htmlElement = element as HTMLElement;
    return htmlElement.offsetHeight;
  }
}
</script>

<style lang="scss">
.card-outter {
  position: relative;
  padding-bottom: 50px;
}
.card-actions {
  width: 100%;
  justify-content: center;
  position: absolute;
  bottom: 0;
}
</style>