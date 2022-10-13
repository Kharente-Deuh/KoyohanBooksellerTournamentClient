export type RegisterPayload = {
  recaptcha: string,
  email: string,
  name: string,
  password: string,
}

export type SendResetPasswordPayload = {
  recaptcha: string,
  email: string,
}

export type ResetPasswordPayload = {
  recaptcha: string
  password: string
  code: string
}

export type SendActivationPayload = {
  recaptcha: string,
  email: string,
}

export type AuthToken = {
  accessToken: string
  refreshToken?: string
}

export type LoginPayload = {
  recaptcha: string,
  email: string
  password: string
}