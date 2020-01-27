const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('large image inclusion [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const imageSource = await page.$eval(
        '#large-image-inclusion',
        elm => elm.src,
      );

      expect(imageSource).toMatch(/^.+media\/large-bart-simpson\..{8}\.gif$/);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
