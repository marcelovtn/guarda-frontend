export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export interface Session {
  user: User
  accessToken: string
  expiresAt: number
}

export interface AuthResponse {
  data?: {
    user?: User | null
    session?: Session | null
    url?: string
  }
  error?: string
}

export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues extends LoginFormValues {
  username: string
  timezone?: string
}

export interface ForgotPasswordFormValues {
  email: string
}
export interface ResetPasswordFormValues {
  password: string
  code: string
}
