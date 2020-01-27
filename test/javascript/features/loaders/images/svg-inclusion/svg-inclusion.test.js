const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('svg inclusion [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const imageSource = await page.$eval('#svg-inclusion', elm => elm.src);

      expect(imageSource).toMatch(/data:image\/svg.+/);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
