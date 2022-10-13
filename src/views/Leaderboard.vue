<template>
  <v-container class="leaderboardContainer">
    <v-row id="selectionButtonsHeader">
      <v-col cols="6">
        <v-btn
          :color="mode === UserType.LIBRARIAN ? colors.green : colors.red"
          :text="mode === UserType.LIBRARIAN"
          :class="mode === UserType.LIBRARIAN ? 'activeMode' : ''"
          @click="mode = UserType.LIBRARIAN"
        >
          CLASSEMENT DES LIBRAIRES
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          :color="mode === UserType.CUSTOMER ? colors.green : colors.red"
          :text="mode === UserType.CUSTOMER"
          :class="mode === UserType.CUSTOMER ? 'activeMode' : ''"
          @click="mode = UserType.CUSTOMER"
        >
          CLASSEMENT DES LECTEURS
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-if="
        mode === UserType.LIBRARIAN ||
        (mode === UserType.CUSTOMER && isCustomerLbAvailable)
      "
      class="membersRow"
    >
      <resizable-table class="leaderboardTable">
        <template v-slot:table="{ table }">
          <v-data-table
            overHeaderId="selectionButtonsHeader"
            :headers="headers"
            :items="leaderboard"
            :search="table.search"
            :items-per-page.sync="table.pageItems"
            :page.sync="table.page"
            loading-text="Chargement..."
            @page-count="table.updatePageCount($event)"
            :loading="false"
            hide-default-footer
          >
          </v-data-table>
        </template>
      </resizable-table>
    </v-row>
    <v-row v-else justify="center" align="center">
      <v-col cols="12">
        <span class="announceText">
          Le classement des lecteurs sera disponible dans:
        </span>
      </v-col>
      <v-col cols="12">
        <timer
          :date="customerStart.toString()"
          @onFinish="isCustomerLbAvailable = true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { v4 as uuid } from "uuid";
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import { namespace } from "vuex-class";

import { User, UserType } from "@/services/apiService/types";
import { colors, customerStart } from "@/utils/constants";
import { isBetter, timeToString } from "@/utils/score.utils";
import userFetcher from "@/utils/userFetcher";

import ResizableTable from "@/components/common/resizableTable.vue";
import Timer from "@/components/timer.vue";

const Store = {
  UserModule: namespace("user"),
  LoaderModule: namespace("loader"),
  AlertModule: namespace("alert"),
};

type LeaderboardUser = {
  name: string;
  score: string;
  time: string;
  rank: number;
};

Component.registerHooks(["beforeRouteEnter"]);
@Component({ name: "leaderboard", components: { ResizableTable, Timer } })
export default class Leaderboard extends Vue {
  beforeRouteEnter(
    to: Route,
    from: Route,
    next: (location?: Location) => void
  ): void {
    console.log("enter");
    userFetcher(to, from, next);
  }

  readonly colors = colors;
  readonly customerStart = customerStart;

  @Store.UserModule.State
  readonly user: User | null;

  @Store.UserModule.State
  readonly users: User[];

  @Store.UserModule.Action
  readonly getUsers: () => Promise<void>;

  @Store.AlertModule.Mutation
  readonly ALERT_ERROR: (message: string) => void;

  @Store.LoaderModule.Mutation
  readonly TOGGLE_PAGE_LOADING: (val: boolean) => void;

  readonly UserType = UserType;

  mode: UserType = UserType.LIBRARIAN;

  isCustomerLbAvailable = new Date() > customerStart;

  mounted(): void {
    if (this.users.length === 0) {
      this.fetchData();
    }
  }

  readonly headers = [
    {
      text: "RANG",
      value: "rank",
      align: "center",
      filterable: false,
      sortable: true,
    },
    {
      text: "NOM",
      value: "name",
      align: "center",
      filterable: true,
      sortable: true,
    },
    {
      text: "SCORE",
      value: "score",
      align: "center",
      filterable: false,
      sortable: true,
    },
    {
      text: "TEMPS",
      value: "time",
      align: "center",
      filterable: false,
      sortable: true,
    },
  ];

  get leaderboard(): LeaderboardUser[] {
    let tmp = this.users.filter(({ type }) => type === this.mode);
    for (let i = 0; i < 100; i++) {
      tmp.push({
        id: uuid(),
        name: uuid(),
        type: this.mode,
        highScore: {
          score: parseInt((Math.random() * 10000).toFixed()),
          time: parseInt((Math.random() * 10000).toFixed()),
        },
      });
    }
    tmp = tmp.sort((a: User, b: User): number => {
      const aWinB = isBetter(a.highScore, b.highScore);
      const bWinA = isBetter(b.highScore, a.highScore);
      return !aWinB && !bWinA ? 0 : aWinB ? -1 : 1;
    });

    return tmp.map(
      (u: User, index: number): LeaderboardUser => ({
        name: u.name,
        score: u.highScore?.score.toString() || "0",
        time: u.highScore ? timeToString(u.highScore.time) : "N/A",
        rank: index + 1,
      })
    );
  }

  async fetchData(): Promise<void> {
    this.TOGGLE_PAGE_LOADING(true);
    try {
      await this.getUsers();
    } catch (error) {
      console.error(error);
      this.ALERT_ERROR("Erreur dans la récupération des données");
    }
    this.TOGGLE_PAGE_LOADING(false);
  }
}
</script>

<style>
.leaderboardContainer {
  padding-left: 0 !important;
  padding-right: 0 !important;
  max-height: calc(100% - 70px) !important;
  height: calc(100% - 70px) !important;
}

.leaderboardTable {
  border: 3px solid transparent !important;
  border-image: linear-gradient(to right, #e11f1c, #74bb85) !important;
  border-image-slice: 1 !important;
}

.activeMode {
  border: solid 1px;
  border-color: #74bb85;
}

.membersRow {
  height: 700px !important;
  max-height: 700px !important;
  margin: 0px !important;
  /* background: white; */
  border: 1px solid transparent !important;
  border-image: linear-gradient(to right, #e11f1c, #74bb85) !important;
  border-image-slice: 1 !important;
}

#selectionButtonsHeader {
  margin-top: 8px;
  margin-bottom: 8px;
}

.announceText {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 200%;
  color: white;
}
</style>