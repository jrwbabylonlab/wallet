module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-var': 'error',
    'no-console': 'warn'
  },
  ignorePatterns: [
    'lib/**/*',
    'dist/**/*',
    'coverage/**/*',
    '*.js',
    '*.mjs'
  ]
};