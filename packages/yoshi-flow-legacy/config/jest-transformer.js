const babelJest = require('babel-jest');
const createBabelConfig = require('yoshi-common/build/create-babel-config')
  .default;

const babelConfig = createBabelConfig();

module.exports = babelJest.createTransformer(babelConfig);
