const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])('small image inclusion [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const imageSource = await page.$eval(
        '#small-image-inclusion',
        elm => elm.src,
      );

      expect(imageSource).toMatch(/^data:image\/jpeg;base64.+==$/);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
