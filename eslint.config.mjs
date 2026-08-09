import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    ignores: ['src/components/ui/**/*'],
  },
  ...compat.extends(
    '@rocketseat/eslint-config/next',
    'next/core-web-vitals',
    'next/typescript',
    'prettier',
  ),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      camelcase: 'off',
      'prettier/prettier': ['error', { printWidth: 100 }],
    },
  },
]
