#!/usr/bin/env node

const config = require('yoshi-config');

if (config.experimentalMonorepo) {
  require('yoshi-flow-monorepo/build/bin/yoshi-monorepo');
} else if (config.projectType === 'app') {
  require('yoshi-flow-app/build/bin/yoshi-app');
} else {
  require('yoshi-flow-legacy/bin/yoshi-legacy');
}
