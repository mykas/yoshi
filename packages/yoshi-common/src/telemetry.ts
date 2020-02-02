import https from 'https';
import semver from 'semver';
import biLoggerClient, { BiLoggerFactory } from 'wix-bi-logger-client';
import initSchemaLogger from 'bi-logger-yoshi';
import { isTypescriptProject, inTeamCity } from 'yoshi-helpers/build/queries';
import { Config } from 'yoshi-config/build/config';

// Create BI factory
const biLoggerFactory = biLoggerClient.factory() as BiLoggerFactory<{
  endpoint: 'string';
}>;

// Register a custom publisher that uses Node's HTTPS API
biLoggerFactory.addPublisher(async (event, context) => {
  // Don't collect telemetry events for Yoshi's e2e tests
  if (process.env.NPM_PACKAGE === 'yoshi-monorepo') {
    return;
  }

  // Collect telemetry only on CI builds
  if (!inTeamCity()) {
    return;
  }

  const queryParams = Object.entries(event)
    .map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)
    .join('&');

  try {
    await new Promise((resolve, reject) => {
      const req = https.request(
        `frog.wix.com/${context.endpoint}?${queryParams}`,
        res => {
          if (
            (res.statusCode && res.statusCode < 200) ||
            (res.statusCode && res.statusCode >= 300)
          ) {
            return reject(`Status code: ${res.statusCode}`);
          }

          res.on('end', resolve);
        },
      );

      req.on('error', reject);

      req.end();
    });
  } catch (error) {
    // Swallow errors
  }
});

// Create logger
const biLogger = initSchemaLogger(biLoggerFactory)();

export async function buildStart(config: Config) {
  const { version: yoshiVersion } = require('../package.json');

  await biLogger.buildStart({
    nodeVersion: `${semver.parse(process.version)?.major}`,
    yoshiVersion: `${semver.parse(yoshiVersion)?.major}`,
    projectName: config.name,
    projectLanguage: isTypescriptProject() ? 'ts' : 'js',
  });
}
