export interface SendVerificationCodeData {
  phone_number: string
}

export interface VerifyPhoneCodeData {
  phone_number: string
  code: number
}
