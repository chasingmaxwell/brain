module.exports = {
  hooks: {
    "pre-commit": "bash -c \"yarn prettier\"",
    "commit-msg": "bash -c \"yarn commitlint -e $GIT_PARAMS\"",
    "pre-push": "bash -c \"yarn lint\""
  }
};
