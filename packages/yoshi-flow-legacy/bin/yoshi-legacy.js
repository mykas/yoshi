#!/usr/bin/env node

const importLocal = require('import-local');

const verifyNodeVersion = require('yoshi-common/build/verify-node-version')
  .default;

verifyNodeVersion();

if (!importLocal(__filename)) {
  require('./yoshi-cli');
}
