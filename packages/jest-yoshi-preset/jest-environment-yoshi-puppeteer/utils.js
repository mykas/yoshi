const globby = require('globby');
const globs = require('yoshi-config/build/globs');
const chalk = require('chalk');

const { MATCH_ENV } = process.env;

module.exports.shouldRunE2Es = async () => {
  const filesPaths = await globby(globs.e2eTests, { gitignore: true });

  return (
    filesPaths.length > 0 &&
    (!MATCH_ENV || MATCH_ENV.split(',').includes('e2e'))
  );
};

module.exports.getBrowserDebugFunction = (page, isDebugMode) => () => {
  if (!isDebugMode) {
    console.log(
      chalk.yellow(
        `Running debugBrowser not in debugMode won't have affect, Click 'd' on your jest's watch mode menu, or set devtools: true in jest-yoshi.config`,
      ),
    );
  }
  return page.evaluate(() => {
    debugger;
  });
};
