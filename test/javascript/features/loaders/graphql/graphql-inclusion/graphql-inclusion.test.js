const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('graphql inclusion [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const innerHTML = await page.$eval(
        '#graphql-inclusion',
        elm => elm.innerHTML,
      );

      expect(JSON.parse(innerHTML)).toMatchObject({ kind: 'Document' });
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
