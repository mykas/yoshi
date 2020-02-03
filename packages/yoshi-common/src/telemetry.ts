import semver from 'semver';
import biLoggerClient, { BiLoggerFactory } from 'wix-bi-logger-client';
import initSchemaLogger, { getLoggerConf } from 'bi-logger-yoshi';
import { isTypescriptProject, inTeamCity } from 'yoshi-helpers/build/queries';
import { Config } from 'yoshi-config/build/config';
import { requestHttps } from './utils/helpers';

// Create BI factory
const biLoggerFactory = biLoggerClient.factory() as BiLoggerFactory<
  ReturnType<typeof getLoggerConf>
>;

// Register a custom publisher that uses Node's HTTPS API
biLoggerFactory.addPublisher(async (eventParams, context) => {
  // Collect telemetry only on CI builds
  if (!inTeamCity()) {
    return;
  }

  try {
    await requestHttps(`frog.wix.com/${context.endpoint}`, eventParams);
  } catch (error) {
    // Swallow errors
  }
});

// Create logger
const biLogger = initSchemaLogger(biLoggerFactory)();

// Function to fire an event
export async function buildStart(config: Config) {
  const { version: yoshiVersion } = require('../package.json');

  await biLogger.buildStart({
    nodeVersion: `${semver.parse(process.version)?.major}`,
    yoshiVersion: `${semver.parse(yoshiVersion)?.major}`,
    projectName: config.name,
    projectLanguage: isTypescriptProject() ? 'ts' : 'js',
    isTestEvent: process.env.NPM_PACKAGE === 'yoshi-monorepo',
  });
}
