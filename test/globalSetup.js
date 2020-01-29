const path = require('path');
const execa = require('execa');
const fs = require('fs-extra');
const tempy = require('tempy');
const {
  publishMonorepo,
  authenticateToRegistry,
} = require('../scripts/utils/publishMonorepo');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const { tmpDirectory } = require('./utils');

module.exports = async globalConfig => {
  // Empty the folder
  fs.emptyDirSync(tmpDirectory);

  await setupPuppeteer(globalConfig);
  const isPublish = !!process.env.WITH_PUBLISH;
  const isCI = !!process.env.TEAMCITY_VERSION;

  if (isPublish && !isCI && !process.env.forcePublish) {
    console.log();
    console.log('------------------------------------');
    console.log();
    console.log(`
      Hey!
      You are trying to run integration tests locally in a slow way,
      using Verdaccio, which will publish the monorepo locally to your file system.
      A better way is to use one of the 'fast' commands, from your package.json,
      or just run 'npx jest --runInBand' with filters as you want (recommended).
      If you still want to run those tests locally with the publish option,
      please add the 'forcePublish' environment variable to the command.
      Please notice that this will change some files on your file system
      and add untracked files. Make sure you do not push those changes.
      Good luck!
      `);
    console.log();
    console.log('------------------------------------');

    process.exit(1);
  }

  if (isPublish) {
    console.log('Starting monorepo publish');
    global.teardown = publishMonorepo();
    global.yoshiPublishDir = tempy.directory();

    await fs.copy(
      path.join(__dirname, 'yoshi-publish'),
      global.yoshiPublishDir,
    );

    console.log('Authenticating to registry');
    authenticateToRegistry(global.yoshiPublishDir);

    console.log('Running yarn install');
    await execa('yarn install --no-lockfile', {
      cwd: global.yoshiPublishDir,
      shell: true,
      stdio: !process.env.DEBUG ? 'pipe' : 'inherit',
      extendEnv: false,
      env: {
        PATH: process.env.PATH,
      },
    });
  }
};
