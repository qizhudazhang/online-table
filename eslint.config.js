import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    ignores: ['**/node_modules', '.git/'],
    rules: {
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: [
            'default',
            'index',
            'Pagination',
            'Overview',
            'Placeholder',
            'Scrollbar',
            'bar',
            'thumb'
          ]
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-undef': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/order-in-components': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/require-default-prop': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      // 'vue/html-closing-bracket-newline': 'off',
      'vue/max-attributes-per-line': [
        0,
        {
          singleline: 10,
          multiline: {
            max: 1,
            allowFirstLine: false
          }
        }
      ]
    }
  }
]
