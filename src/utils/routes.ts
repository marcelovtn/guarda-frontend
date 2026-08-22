export const publicRoutes = {
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CONFIRM_EMAIL: '/auth-flow/email-verification',
  REGISTRATION_CONFIRMATION: '/auth-flow/registration-confirmation',
  INTRODUCTION: '/',
  /** Public instructor page — the only content a non-subscriber can see. */
  INSTRUCTOR_PROFILE: (slug: string) => `/p/${slug}`,
}

export const protectedRoutes = {
  HOME: '/home',
  SETTINGS: '/settings',
  OWNER: '/owner',
}

/** Everything a subscribed student navigates. */
export const studentRoutes = {
  HOME: '/home',
  TRACKS: '/tracks',
  TRACK: (slug: string) => `/tracks/${slug}`,
  VIDEOS: '/videos',
  LESSON: (id: string) => `/lessons/${id}`,
  ACCOUNT: '/account',
  SUBSCRIBE_PLANS: '/subscribe/plans',
  SUBSCRIBE_CHECKOUT: '/subscribe/checkout',
  /** Where Stripe returns the student after paying. */
  SUBSCRIBE_SUCCESS: '/subscribe/success',
}

/** Everything an instructor navigates. Requires an Instructor row. */
export const instructorRoutes = {
  LESSONS: '/instructor/lessons',
  NEW_LESSON: '/instructor/lessons/new',
  LESSON: (id: string) => `/instructor/lessons/${id}`,
  TRACKS: '/instructor/tracks',
  TRACK: (id: string) => `/instructor/tracks/${id}`,
  STUDENTS: '/instructor/students',
  PROFILE: '/instructor/profile',
}

export const resetPasswordPath = '/auth/reset-password'
