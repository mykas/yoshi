const { matchCSS } = require('../../../../../utils');
const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('sass inclusion camel case [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);

      const className = await page.$eval('#sass-camelcase-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('app', page, [
        new RegExp(`.${className}{background:#ccc;color:#000;*}`),
      ]);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
