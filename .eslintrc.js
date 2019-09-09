module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script'
  },
  extends: 'eslint:recommended',
  env: {
    browser: false,
    node: true,
    es6: true
  },
  overrides: [
    // mocha files
    {
      files: [
        'tests/**/*.js'
      ],
      env: {
        mocha
      }
    }
  ]
};
