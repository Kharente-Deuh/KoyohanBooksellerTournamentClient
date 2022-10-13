import { getAuth, applyActionCode } from "firebase/auth";
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { LocalStorageService } from "@/services/localStorage.service";
import store from "@/store";

const firebaseConfig = {
  apiKey: "AIzaSyDCJbi9BGV1qK6tAF_156LzMyQPbryax20",
  authDomain: "koyohanbooksellertournament.firebaseapp.com",
  projectId: "koyohanbooksellertournament",
  storageBucket: "koyohanbooksellertournament.appspot.com",
  messagingSenderId: "65747860884",
  appId: "1:65747860884:web:cc00ccd9afb0cec4b2e381"
}

const firebase = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebase)

export { analytics }

export const verifyEmail = async (oobCode: string): Promise<void> => {
  try {
    await applyActionCode(getAuth(), oobCode)
  } catch (e) {
    console.log(e)
    throw "Lien invalide"
  }
}

export const logout = (): void => {
  const localStorageService = new LocalStorageService()
  localStorageService.removeAccessToken()
  localStorageService.removeRefreshToken()
  store.commit("user/SET_USER", null)
}