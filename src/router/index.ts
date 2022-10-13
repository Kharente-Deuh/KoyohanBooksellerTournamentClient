import { AuthRoutes, CustomerRoutes, RouteName, Routes } from "@/router/types";
import Vue from "vue";
import VueRouter, { RawLocation, Route, RouteConfig } from "vue-router";
import Game from "../views/Game.vue";
import Leaderboard from "../views/Leaderboard.vue";
import Rewards from "../views/Rewards.vue"
import TheBoxer from "../views/TheBoxer.vue"
import ResetPassword from "../views/auth/ResetPassword.vue"
import Activation from "../views/auth/Activation.vue";
import SendActivation from "../views/auth/SendActivation.vue";
import SendResetPassword from "../views/auth/SendResetPassword.vue";
import Home from "../views/Home.vue"
import { librarianStart, customerStart, eventEnd } from "@/utils/constants"

import { LocalStorageService } from "@/services/localStorage.service";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/" + RouteName.HOME,
    name: RouteName.HOME,
    component: Home,
  },
  {
    path: "/" + RouteName.GAME,
    name: RouteName.GAME,
    component: Game,
  },
  {
    path: "/" + RouteName.LEADERBORAD,
    name: RouteName.LEADERBORAD,
    component: Leaderboard,
  },
  {
    path: "/" + RouteName.REWARDS,
    name: RouteName.REWARDS,
    component: Rewards,
  },
  {
    path: "/" + RouteName.THE_BOXER,
    name: RouteName.THE_BOXER,
    component: TheBoxer,
  },
  {
    path: "/auth/" + RouteName.SEND_ACTIVATION,
    name: RouteName.SEND_ACTIVATION,
    component: SendActivation,
  },
  {
    path: "/auth/" + RouteName.ACTIVATION + "/:hash",
    name: RouteName.ACTIVATION,
    component: Activation,
  },
  {
    path: "/auth/" + RouteName.SEND_RESET_PASSWORD,
    name: RouteName.SEND_RESET_PASSWORD,
    component: SendResetPassword,
  },
  {
    path: "/auth/" + RouteName.RESET_PASSWORD + "/:hash",
    name: RouteName.RESET_PASSWORD,
    component: ResetPassword,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to: Route, from: Route, next) => {
  console.log(new Date(librarianStart))
  console.log(customerStart)
  console.log(eventEnd)
  const now = new Date()
  const defaultRoute: RawLocation = { name: now < eventEnd ? RouteName.GAME : RouteName.LEADERBORAD }
  const toName = to.name ? to.name as RouteName : null

  console.log(`${to.path} - ${to.name}`)

  const initialStart = new Date(librarianStart)

  if (now < initialStart && toName !== RouteName.HOME) {
    return next({ name: RouteName.HOME })
  }

  if (!toName || to.path === "/" || !Routes.includes(toName)) {
    return next(defaultRoute)
  }

  if ((toName === RouteName.GAME || AuthRoutes.includes(toName)) && now > eventEnd) {
    return next(defaultRoute)
  }

  if (CustomerRoutes.includes(toName) && now < customerStart) {
    return next(defaultRoute)
  }

  const localStorageSevice = new LocalStorageService()
  const jwt: string | null = localStorageSevice.getAccessToken()
  if (jwt !== null && AuthRoutes.includes(toName)) {
    return next(defaultRoute)
  }

  return next()
})

export default router;
