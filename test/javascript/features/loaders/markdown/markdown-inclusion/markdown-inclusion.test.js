const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('markdown inclusion [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const innerHTML = await page.$eval(
        '#markdown-inclusion',
        elm => elm.innerHTML,
      );

      expect(innerHTML.replace(/\n/g, '')).toEqual('## Hello World');
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
