module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'node': true,
    'jest': true,
    'cypress/globals': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'ecmaFeatures': {
      'jsx': true,
    },
    'sourceType': 'module',
  },
  'plugins': [
    'react', 'jest', 'cypress',
  ],
  'rules': {
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'no-console': 0,
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': ['error', { 'varsIgnorePattern': '^_', 'argsIgnorePattern': '^_' }],
    'comma-dangle': ['error', 'always-multiline'],
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
}
