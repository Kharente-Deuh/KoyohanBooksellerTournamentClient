import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import user from "./modules/user.module"
import alert from "./modules/alert.module"
import loader from "./modules/loader.module"
export default new Vuex.Store({
  modules: {
    user,
    alert,
    loader
  },
});
