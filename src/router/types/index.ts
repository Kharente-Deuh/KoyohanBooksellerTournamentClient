export enum RouteName {
  HOME = "home",
  GAME = "jeu",
  SEND_ACTIVATION = "sendActivation",
  ACTIVATION = "activation",
  SEND_RESET_PASSWORD = "sendResetPassword",
  RESET_PASSWORD = "password",
  LEADERBORAD = "classement",
  THE_BOXER = "theBoxer",
  REWARDS = "recompenses"
}

export const AuthRoutes: RouteName[] = [ RouteName.ACTIVATION, RouteName.RESET_PASSWORD, RouteName.SEND_ACTIVATION ]

export const CustomerRoutes: RouteName[] = [ RouteName.SEND_ACTIVATION, RouteName.RESET_PASSWORD ]

export const Routes = Object.entries(RouteName).filter(entry => !parseInt(entry[0])).map(entry => entry[1])
