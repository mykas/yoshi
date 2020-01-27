const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod'])('optimize [%s]', mode => {
  describe('tree shaking', () => {
    it('removes unused exports', async () => {
      await scripts[mode](async () => {
        const logs = [];

        page.on('console', msg => {
          if (msg.type() === 'info') {
            logs.push(msg.text());
          }
        });

        await page.goto(scripts.serverUrl);

        expect(logs).toEqual(['module-with-multiple-exports']);
      });
    });
  });
});
