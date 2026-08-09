import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const SALT = 'salt'
const IV_LENGTH = 16
const KEY_LENGTH = 32
export const ENCRYPTION_PREFIX = 'scrambled:'

export function getKeyBuffer(masterKey: string): Buffer {
  return crypto.scryptSync(masterKey, SALT, KEY_LENGTH)
}

export function encryptText(plainText: string, keyBuffer: Buffer): string {
  if (plainText.startsWith(ENCRYPTION_PREFIX)) {
    return plainText
  }

  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv)
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
  return `${ENCRYPTION_PREFIX}${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export function decryptText(encryptedText: string, keyBuffer: Buffer): string {
  if (!encryptedText.startsWith(ENCRYPTION_PREFIX)) {
    throw new Error('Invalid prefix for encrypted text')
  }
  const withoutPrefix = encryptedText.slice(ENCRYPTION_PREFIX.length)
  const [ivHex, dataHex] = withoutPrefix.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encryptedData = Buffer.from(dataHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv)
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()])
  return decrypted.toString('utf8')
}

export function encryptPersonalKey(personalKey: string, masterKey: string): string {
  const keyBuffer = getKeyBuffer(masterKey)
  return encryptText(personalKey, keyBuffer)
}

export function decryptPersonalKey(encryptedPersonalKey: string, masterKey: string): string {
  const keyBuffer = getKeyBuffer(masterKey)
  return decryptText(encryptedPersonalKey, keyBuffer)
}

export function generatePersonalKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex')
}

export function getMasterKey(): { masterKey: string | null; error: Error | null } {
  const masterKey = process.env.NEXT_PUBLIC_MASTER_ENCRYPTION_KEY

  if (!masterKey) {
    return {
      masterKey: null,
      error: new Error('Missing NEXT_PUBLIC_MASTER_ENCRYPTION_KEY environment variable'),
    }
  }
  return { masterKey, error: null }
}

export function scrambleKey(personalKey: string, masterKey: string): string {
  return encryptPersonalKey(personalKey, masterKey)
}

export function unscrambleKey(encryptedKey: string, masterKey: string): string {
  return decryptPersonalKey(encryptedKey, masterKey)
}

export async function generateAndScrambleKey(
  userId: string,
  apiClient: any,
  insertKeyCallback: (
    apiClient: any,
    userId: string,
    scrambledKey: string,
  ) => Promise<Error | null>,
): Promise<{ personalKey: string | null; error: Error | null }> {
  const personalKey = generatePersonalKey()
  const { masterKey, error: masterKeyError } = getMasterKey()
  if (masterKeyError) {
    return { personalKey: null, error: masterKeyError }
  }

  const scrambledKey = scrambleKey(personalKey, masterKey as string)
  const storeError = await insertKeyCallback(apiClient, userId, scrambledKey)
  if (storeError) {
    return { personalKey: null, error: storeError }
  }

  return { personalKey, error: null }
}
