// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierConfig = require('./.prettierrc')

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
    'simple-import-sort',
    'prettier'
  ],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      },
      alias: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      }
    },
    react: {
      version: 'detect'
    }
  },
  globals: {
    USE_HASH_ROUTER: 'readonly'
  },
  rules: {
    // Import plugin
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        tsx: 'never',
        ts: 'never'
      }
    ], // don't require extension for these
    'import/prefer-default-export': 'off', // named exports are "better"
    'import/no-relative-packages': 'off', // there are no workspaces
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true
      }
    ],

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'react/destructuring-assignment': 'off', // too strict
    'react/react-in-jsx-scope': 'off', // not needed anymore
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/function-component-definition': 'off', // seems to be broken with TS
    'react/require-default-props': 'off', // not needed with TS

    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'], // use "type" instead of "interface"
    '@typescript-eslint/array-type': ['error', { default: 'array', readOnly: 'array' }], // use T[] instead of Array<T>
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // Prettier
    'prettier/prettier': ['error', prettierConfig]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}
