const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('externals [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const result = await page.$eval('#externals', elm => elm.textContent);

      expect(result).toBe('Some external text.');
    });
  });

  // it('component tests', async () => {
  //   await scripts.test(mode);
  // });
});
