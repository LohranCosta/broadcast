import js from '@eslint/js'
import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  globalIgnores(['lib', 'coverage']),
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration, ClassExpression',
          message: 'O projeto segue o paradigma funcional: use funções em vez de classes.',
        },
      ],
    },
  },
  prettier,
)
