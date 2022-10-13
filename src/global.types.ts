export type VForm = Vue & { 
  validate: () => boolean,
  resetValidation: () => void,
  reset: () => void,
}

export enum RequestAlertType {
  Success = "success",
  Error = "error"
}

export type AlertWithData = {
  message: string
  data: unknown
  pluralize?: boolean
}

export type RequestAlert = {
  message: string
  messageData?: unknown
  pluralize?: boolean
  type: RequestAlertType
}