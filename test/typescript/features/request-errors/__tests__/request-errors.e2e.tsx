let originalConsole: Console;
beforeEach(() => {
  originalConsole = global.console;
});

afterEach(() => {
  global.console = originalConsole;
});

it('request-errors', async () => {
  // @ts-ignore
  global.console = { warn: jest.fn() };

  await page.goto('http://localhost:3100');

  expect(global.console.warn).toBeCalledWith(
    `url: http://localhost:9999/no.bundle.min.js, errText: net::ERR_CONNECTION_REFUSED, method: GET`,
  );
});
