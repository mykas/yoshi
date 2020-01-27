const { matchJS } = require('../../../utils');
const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('moment [%s]', mode => {
  it('exclude locales imported from moment', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      // should not include the `en` locale
      await matchJS('app', page, [/^((?!hello).)*$/]);
    });
  });

  it('include locales imported outside of moment', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      // should not include the `en` locale
      await matchJS('app', page, [/hallo/]);
    });
  });
});
