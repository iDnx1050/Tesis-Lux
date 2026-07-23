import js from '@eslint/js'

export default [
  {
    ...js.configs.recommended,
    rules: {
      ...js.configs.recommended.rules,
      'no-undef': 'off',        // TypeScript ya valida esto
      'no-unused-vars': 'off',  // TypeScript ya valida esto
      'no-console': 'off',
    },
    ignores: ['node_modules/**', '.next/**', 'out/**'],
  },
]
