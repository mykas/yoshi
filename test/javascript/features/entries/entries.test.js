const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('entries [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(`${scripts.serverUrl}/other`);
      const innerHTML = await page.$eval('#other', elm => elm.innerHTML);

      expect(innerHTML).toEqual('Other App');
    });
  });
});
