module.exports = {
  root: true,
  // The declaration files the build emits are generated, not authored.
  ignorePatterns: ['dist', 'node_modules'],
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
