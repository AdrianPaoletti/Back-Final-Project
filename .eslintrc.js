module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base', 'airbnb-typescript/base', 'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    'import/first': 'off',
  },
  
};
