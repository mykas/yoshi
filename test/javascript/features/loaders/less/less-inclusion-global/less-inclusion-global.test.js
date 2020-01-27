const { matchCSS } = require('../../../../../utils');
const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('less inclusion global [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      await matchCSS('app', page, [
        /\.global-less-modules-inclusion\{background:#ccc;color:#000;*}/,
      ]);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
