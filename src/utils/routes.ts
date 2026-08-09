export const publicRoutes = {
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CONFIRM_EMAIL: '/auth-flow/email-verification',
  REGISTRATION_CONFIRMATION: '/auth-flow/registration-confirmation',
  INTRODUCTION: '/',
}
export const protectedRoutes = {
  HOME: '/home',
  SETTINGS: '/settings',
  OWNER: '/owner',
}
export const resetPasswordPath = '/auth/reset-password'
