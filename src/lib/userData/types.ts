export interface UserDataDTO {
  id?: string
  data: Record<string, any>
}

export type UserDataResponse = {
  data?: UserDataDTO
  error?: string
}

export interface DataObject {
  [key: string]: any
}

export interface DeleteAccountResult {
  success: true
  message: string
  id: string
}
