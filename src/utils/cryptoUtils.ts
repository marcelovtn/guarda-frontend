import {
  decryptText,
  ENCRYPTION_PREFIX,
  encryptText,
  getKeyBuffer,
  getMasterKey,
} from '@/utils/keyEncryptionUtils'

export function requireKeyBuffer(): Buffer {
  const { masterKey, error } = getMasterKey()
  if (error || !masterKey) {
    throw error || new Error('Missing master key')
  }
  return getKeyBuffer(masterKey)
}

export function encryptName(
  name: string,
  keyBuffer: Buffer,
  shouldEncrypt: boolean = true,
): string {
  if (!shouldEncrypt) {
    return name
  }
  if (name.startsWith(ENCRYPTION_PREFIX)) {
    return name
  }
  return encryptText(name, keyBuffer)
}

export function decryptName(raw: string, keyBuffer: Buffer): string {
  if (!raw.startsWith(ENCRYPTION_PREFIX)) {
    return raw
  }

  try {
    return decryptText(raw, keyBuffer)
  } catch (error) {
    // console.log({ error })
    console.error('Decryption error:', (error as Error).message)
    return raw
  }
}

export function decryptList<T extends { name: string }>(list: T[]): T[] {
  try {
    const keyBuffer = requireKeyBuffer()

    const decryptedList = list.map((item) => {
      try {
        const decryptedName = decryptName(item.name, keyBuffer)

        const decryptedItem = {
          ...item,
          name: decryptedName,
        }

        return decryptedItem
      } catch (error) {
        console.error(`Failed to decrypt name for item: ${JSON.stringify(item)}`)
        console.error('Decryption error:', (error as Error).message)
        return item
      }
    })

    if (decryptedList.length === 0) {
      console.warn('Decrypted list is empty, no items to return.')
    }

    return decryptedList
  } catch (error) {
    console.error('Could not get key buffer, decryption for entire list failed.', error)
    return list
  }
}
