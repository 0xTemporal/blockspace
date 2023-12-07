/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@blockspace/eslint-config/next.js', 'plugin:next-on-pages/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['next-on-pages', 'drizzle'],
  rules: {
    'next-on-pages/no-unsupported-configs': 'warn',
  },
}
