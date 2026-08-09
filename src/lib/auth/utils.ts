import type { TFunction } from 'i18next'
import { AuthResponse } from './types'

export const AUTH_ERROR_MESSAGES = {
  'Invalid login credentials': 'Email ou senha incorretos. Por favor, verifique suas credenciais.',
  'Email not confirmed': 'Por favor, confirme seu email antes de fazer login.',
  'Invalid email format': 'Formato de email inválido.',
  'User already registered':
    'Este email já está registrado. Por favor, faça login ou recupere sua senha.',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
  'Email not found': 'Email não encontrado em nossa base.',
  'Invalid token': 'Token inválido ou expirado.',
  'New password should be different from the old password.':
    'A nova senha deve ser diferente da senha antiga.',
  'Token has expired': 'O token de verificação expirou. Por favor, solicite um novo.',
  'Token has already been used':
    'Este link já foi utilizado. Por favor, solicite um novo se necessário.',
  'Invalid password': 'A senha não atende aos requisitos mínimos de segurança.',
  'Too many requests': 'Muitas tentativas. Por favor, aguarde alguns minutos.',
  default: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  no_user_data: 'Não foi possível completar a operação. Por favor, tente novamente.',
} as const

/**
 * Mapeia códigos de erro do Better Auth para chaves de tradução
 */
const BETTER_AUTH_ERROR_CODE_MAP: Record<string, string> = {
  INVALID_EMAIL: 'ERROR_INVALID_EMAIL',
  INVALID_PASSWORD: 'ERROR_INVALID_PASSWORD',
  INVALID_CREDENTIALS: 'ERROR_INVALID_CREDENTIALS',
  INVALID_EMAIL_OR_PASSWORD: 'ERROR_INVALID_CREDENTIALS',
  USER_ALREADY_EXISTS: 'ERROR_USER_ALREADY_EXISTS',
  EMAIL_NOT_FOUND: 'ERROR_EMAIL_NOT_FOUND',
  INVALID_TOKEN: 'ERROR_INVALID_TOKEN',
  TOKEN_EXPIRED: 'ERROR_TOKEN_EXPIRED',
  TOKEN_ALREADY_USED: 'ERROR_TOKEN_ALREADY_USED',
  PASSWORD_TOO_SHORT: 'ERROR_PASSWORD_TOO_SHORT',
  PASSWORD_TOO_WEAK: 'ERROR_PASSWORD_TOO_WEAK',
  EMAIL_NOT_VERIFIED: 'ERROR_EMAIL_NOT_VERIFIED',
  TOO_MANY_REQUESTS: 'ERROR_TOO_MANY_REQUESTS',
}

/**
 * Mapeia mensagens de erro do Better Auth para chaves de tradução
 * (fallback quando o código não está disponível)
 */
const BETTER_AUTH_ERROR_MESSAGE_MAP: Record<string, string> = {
  'Invalid email': 'ERROR_INVALID_EMAIL',
  'Invalid password': 'ERROR_INVALID_PASSWORD',
  'Invalid credentials': 'ERROR_INVALID_CREDENTIALS',
  'Invalid email or password': 'ERROR_INVALID_CREDENTIALS',
  'User already exists': 'ERROR_USER_ALREADY_EXISTS',
  'User with email already exists': 'ERROR_USER_ALREADY_EXISTS',
  'Email not found': 'ERROR_EMAIL_NOT_FOUND',
  'Invalid token': 'ERROR_INVALID_TOKEN',
  'Token expired': 'ERROR_TOKEN_EXPIRED',
  'Token already used': 'ERROR_TOKEN_ALREADY_USED',
  'Password too short': 'ERROR_PASSWORD_TOO_SHORT',
  'Password too weak': 'ERROR_PASSWORD_TOO_WEAK',
  'Email not verified': 'ERROR_EMAIL_NOT_VERIFIED',
  'Too many requests': 'ERROR_TOO_MANY_REQUESTS',
  'Email already in use': 'ERROR_USER_ALREADY_EXISTS',
  'Email is already in use': 'ERROR_USER_ALREADY_EXISTS',
  'This email is already registered': 'ERROR_USER_ALREADY_EXISTS',
  'Password must be at least 8 characters': 'ERROR_PASSWORD_TOO_SHORT',
}

/**
 * Traduz um erro do Better Auth usando i18n
 * @param error - Objeto de erro do Better Auth (pode ter code e message)
 * @param t - Função de tradução do i18n
 * @param fallbackKey - Chave de fallback caso o erro não seja mapeado
 * @returns Mensagem de erro traduzida
 */
export function translateBetterAuthError(
  error: { code?: string; message?: string; status?: number } | Error | string | null | undefined,
  t: TFunction<'auth', undefined>,
  fallbackKey: string = 'ERROR_UNKNOWN',
): string {
  if (!error) {
    return t(fallbackKey)
  }

  // Se for string, tenta mapear diretamente
  if (typeof error === 'string') {
    const code = error.toUpperCase().replace(/\s+/g, '_')
    const translationKey = BETTER_AUTH_ERROR_CODE_MAP[code]
    if (translationKey) {
      return t(translationKey)
    }
    return t(fallbackKey)
  }

  // Função auxiliar para extrair mensagem de diferentes estruturas
  const extractMessage = (err: any): string | undefined => {
    return (
      err.body?.message ||
      err.data?.message ||
      err.error?.message ||
      err.response?.data?.message ||
      err.response?.message ||
      err.message
    )
  }

  // Se for Error, verifica se tem code, status ou message
  if (error instanceof Error) {
    const errorAny = error as any

    // Verifica status 403 (email não verificado)
    if (errorAny.status === 403) {
      return t('ERROR_EMAIL_NOT_VERIFIED')
    }

    // Verifica status 422 (validation error)
    if (errorAny.status === 422) {
      const validationMessage = extractMessage(errorAny)

      if (validationMessage) {
        // Tenta mapear pela mensagem exata
        const messageKey = BETTER_AUTH_ERROR_MESSAGE_MAP[validationMessage]
        if (messageKey) {
          return t(messageKey)
        }

        // Tenta busca parcial (case insensitive)
        const lowerValidationMessage = validationMessage.toLowerCase()
        for (const [key, value] of Object.entries(BETTER_AUTH_ERROR_MESSAGE_MAP)) {
          if (lowerValidationMessage.includes(key.toLowerCase())) {
            return t(value)
          }
        }

        // Se não conseguiu mapear, retorna a mensagem original
        return validationMessage
      }
    }

    // Tenta extrair código do erro se houver
    const errorCode = errorAny.code
    if (errorCode && typeof errorCode === 'string') {
      const translationKey = BETTER_AUTH_ERROR_CODE_MAP[errorCode]
      if (translationKey) {
        return t(translationKey)
      }
    }

    // Se não tiver código, tenta mapear pela mensagem
    if (error.message) {
      // Primeiro tenta mapear pela mensagem exata
      const messageKey = BETTER_AUTH_ERROR_MESSAGE_MAP[error.message]
      if (messageKey) {
        return t(messageKey)
      }

      // Tenta busca parcial (case insensitive)
      const lowerMessage = error.message.toLowerCase()
      for (const [key, value] of Object.entries(BETTER_AUTH_ERROR_MESSAGE_MAP)) {
        if (lowerMessage.includes(key.toLowerCase())) {
          return t(value)
        }
      }

      // Se não encontrar, tenta normalizar a mensagem para código
      const code = error.message.toUpperCase().replace(/\s+/g, '_')
      const translationKey = BETTER_AUTH_ERROR_CODE_MAP[code]
      if (translationKey) {
        return t(translationKey)
      }

      // Se nenhum mapeamento foi encontrado, retorna a mensagem original
      return error.message
    }

    return t(fallbackKey)
  }

  // Se for objeto com code, status ou message
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any

    // Verifica status 403 (email não verificado)
    if (errorObj.status === 403) {
      return t('ERROR_EMAIL_NOT_VERIFIED')
    }

    // Verifica status 422 (validation error)
    if (errorObj.status === 422) {
      const validationMessage = extractMessage(errorObj)

      if (validationMessage) {
        // Tenta mapear pela mensagem exata
        const messageKey = BETTER_AUTH_ERROR_MESSAGE_MAP[validationMessage]
        if (messageKey) {
          return t(messageKey)
        }

        // Tenta busca parcial (case insensitive)
        const lowerValidationMessage = validationMessage.toLowerCase()
        for (const [key, value] of Object.entries(BETTER_AUTH_ERROR_MESSAGE_MAP)) {
          if (lowerValidationMessage.includes(key.toLowerCase())) {
            return t(value)
          }
        }

        // Se não conseguiu mapear, retorna a mensagem original
        return validationMessage
      }
    }

    // Prioriza o código
    if (errorObj.code) {
      const translationKey = BETTER_AUTH_ERROR_CODE_MAP[errorObj.code]
      if (translationKey) {
        return t(translationKey)
      }
    }

    // Se não tiver código, tenta extrair e mapear pela mensagem
    const message = extractMessage(errorObj)
    if (message) {
      // Primeiro tenta mapear pela mensagem exata
      const messageKey = BETTER_AUTH_ERROR_MESSAGE_MAP[message]
      if (messageKey) {
        return t(messageKey)
      }

      // Tenta busca parcial (case insensitive)
      const lowerMessage = message.toLowerCase()
      for (const [key, value] of Object.entries(BETTER_AUTH_ERROR_MESSAGE_MAP)) {
        if (lowerMessage.includes(key.toLowerCase())) {
          return t(value)
        }
      }

      // Se não encontrar, tenta normalizar a mensagem para código
      const code = message.toUpperCase().replace(/\s+/g, '_')
      const translationKey = BETTER_AUTH_ERROR_CODE_MAP[code]
      if (translationKey) {
        return t(translationKey)
      }

      // Se nenhum mapeamento foi encontrado, retorna a mensagem original
      return message
    }

    return t(fallbackKey)
  }

  return t(fallbackKey)
}

export function handleAuthResponse(error: Error | null, data?: any): AuthResponse {
  if (error) {
    const errorMessage =
      AUTH_ERROR_MESSAGES[error.message as keyof typeof AUTH_ERROR_MESSAGES] ||
      AUTH_ERROR_MESSAGES.default
    return { error: errorMessage }
  }
  return { data }
}
