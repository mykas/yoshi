const { matchCSS } = require('../../../../../utils');
const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])('css relative url [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      await matchCSS('app', page, [
        /background-image:url\(media\/large-bart-simpson\..{8}\.gif\)/,
      ]);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
