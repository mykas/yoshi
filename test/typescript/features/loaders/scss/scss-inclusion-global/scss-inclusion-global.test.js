const { matchCSS } = require('../../../../../utils');
const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])('scss inclusion global [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      await matchCSS('app', page, [
        /\.global-scss-modules-inclusion\{background:#ccc;color:#000;*}/,
      ]);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
