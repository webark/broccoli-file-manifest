module.exports = {
  "hooks": {
    "pre-commit": "yarn test",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
  }
} 