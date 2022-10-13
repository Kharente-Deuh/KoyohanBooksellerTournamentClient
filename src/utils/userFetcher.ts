import { RouteName } from "@/router/types";
import { logout } from "@/services/firebase.service";
import { LocalStorageService } from "@/services/localStorage.service";
import store from "@/store";
import { Route } from "vue-router";

export default async (
  to: Route,
  from: Route,
  next: (location?: Location) => void
): Promise<void> => {
  if (store.state.user.user) {
    return next()
  }

  const localStorageService = new LocalStorageService();
  if (!localStorageService.getAccessToken()) {
    return next()
  }

  store.commit("loader/TOGGLE_PAGE_LOADING", true);
  try {
    await store.dispatch("user/fetchCurrentUser");
  } catch {
    logout();
  }

  store.commit("loader/TOGGLE_PAGE_LOADING", false);
  next()
};