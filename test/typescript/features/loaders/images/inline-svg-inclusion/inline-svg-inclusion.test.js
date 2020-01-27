const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])('inline svg inclusion [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const imageSource = await page.$eval(
        '#inline-svg-inclusion',
        elm => elm.src,
      );

      expect(imageSource).toMatch(/svg/);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
