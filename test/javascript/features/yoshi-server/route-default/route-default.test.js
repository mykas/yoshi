const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.YOSHI_SERVER_JS,
});

describe.each(['prod', 'dev'])('yoshi-server default route [%s]', mode => {
  it('run tests', async () => {
    await scripts[mode](async () => {
      await page.goto(`${scripts.serverUrl}`);
      const title = await page.$eval('h1', elm => elm.innerText);
      expect(title).toBe('hello from yoshi server');
    });
  });
});
