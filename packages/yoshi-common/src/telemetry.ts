import https from 'https';
import semver from 'semver';
import biLoggerClient, { BiLoggerFactory } from 'wix-bi-logger-client';
import initSchemaLogger from 'bi-logger-yoshi';
import { isTypescriptProject as checkIsTypescriptProject } from 'yoshi-helpers/build/queries';
import { Config } from 'yoshi-config/build/config';

// Create BI factory
const biLoggerFactory = biLoggerClient.factory() as BiLoggerFactory<{
  endpoint: 'string';
}>;

// Register a custom publisher that uses Node's HTTPS API
biLoggerFactory.addPublisher((event, context) => {
  const queryParams = Object.entries(event)
    .map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)
    .join('&');

  return new Promise((resolve, reject) => {
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
});

// Create logger
const biLogger = initSchemaLogger(biLoggerFactory)();

export async function collectData(config: Config) {
  // Don't fire telemetry events for Yoshi's e2e tests
  if (process.env.NPM_PACKAGE !== 'yoshi-monorepo') {
    const { version: yoshiVersion } = require('../package.json');
    const isTypescriptProject = checkIsTypescriptProject();

    await biLogger
      .buildStart({
        nodeVersion: `${semver.parse(process.version)?.major}`,
        yoshiVersion: `${semver.parse(yoshiVersion)?.major}`,
        projectName: config.name,
        projectLanguage: isTypescriptProject ? 'ts' : 'js',
      })
      // Swallow errros
      .catch(() => {})
      // Ensure promise is voided
      .then(() => {});
  }
}
