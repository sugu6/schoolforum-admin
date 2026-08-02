import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import importX from 'eslint-plugin-import-x';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  {
    ignores: ['eslint.config.js', '*.json', 'dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  ...vuePlugin.configs['flat/recommended'],
  prettierRecommended,
  {
    files: ['**/*.{ts,tsx,vue,js,jsx}'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'import-x': importX,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // Prettier 作为格式告警，避免阻塞提交
      'prettier/prettier': 1,
      // Vue
      'vue/require-default-prop': 0,
      'vue/singleline-html-element-content-newline': 0,
      'vue/max-attributes-per-line': 0,
      'vue/custom-event-name-casing': [2, 'camelCase'],
      'vue/no-v-text': 1,
      'vue/padding-line-between-blocks': 1,
      'vue/require-direct-export': 1,
      'vue/multi-word-component-names': 0,
      // 项目中 markdown 渲染需要 v-html
      'vue/no-v-html': 0,
      // TypeScript
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-unused-vars': 1,
      '@typescript-eslint/no-empty-function': 1,
      '@typescript-eslint/no-explicit-any': 0,
      // 项目中 AnyObject 作为语义化类型别名保留
      '@typescript-eslint/no-empty-object-type': 0,
      // Import
      'import-x/extensions': [
        2,
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import-x/no-extraneous-dependencies': 0,
      // 通用
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      'no-param-reassign': 0,
      'prefer-regex-literals': 0,
    },
  },
];
