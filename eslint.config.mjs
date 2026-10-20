import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import jsxA11y from 'eslint-plugin-jsx-a11y'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next registers the jsx-a11y plugin but enables only a few
  // rules; turn on the full recommended set (Technical plan §9).
  {
    files: ['**/*.{jsx,tsx}'],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    rules: {
      // `_`-prefixed bindings are intentionally unused (prop stripping in Button)
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
