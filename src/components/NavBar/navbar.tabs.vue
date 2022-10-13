<template>
  <v-tabs fixed-tabs>
    <v-tabs-slider :color="colors.red" />
    <v-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :rev="`tab-${index}`"
      :to="tab.link"
      class="font-weight-normal"
    >
      {{ tab.title }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
/** VUE */
import { Component, Vue } from "vue-property-decorator";
import { colors } from "@/utils/constants";
import { RouteName } from "@/router/types";
import { customerStart, eventEnd } from "@/utils/constants"
import { namespace } from "vuex-class";
import { User, UserType } from "@/services/apiService/types";


type NavBarTab = {
  title: string;
  link: { name: RouteName };
};

const Store = { UserModule: namespace("user") }

@Component({ name: "nav-bar-tabs" })
export default class NavBarTabs extends Vue {
  @Store.UserModule.State
  readonly user: User | null
  
  readonly colors = colors;

  get tabs(): NavBarTab[] {
    const now = new Date()
    const tabs: NavBarTab[] = [
      {
        title: "Jeu",
        link: { name: RouteName.GAME },
      },
      {
        title: "Récompenses",
        link: { name: RouteName.REWARDS },
      },
      {
        title: "Classement",
        link: { name: RouteName.LEADERBORAD },
      },
      {
        title: "The Boxer",
        link: { name: RouteName.THE_BOXER },
      },
    ];

    if (now > eventEnd || (this.user?.type === UserType.LIBRARIAN && now > customerStart)) {
      tabs.shift()
    }

    return tabs
  }
}
</script>
