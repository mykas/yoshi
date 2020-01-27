process.on('unhandledRejection', error => {
  throw error;
});

import arg from 'arg';
import loadConfig from 'yoshi-config/loadConfig';
import { Config } from 'yoshi-config/build/config';
import normalizeDebuggingArgs from 'yoshi-common/normalize-debugging-args';
import verifyDependencies from 'yoshi-common/verify-dependencies';
import verifyNodeVersion from 'yoshi-common/verify-node-version';
import { generateFlowEditorModel, FlowEditorModel } from './model';

const defaultCommand = 'start';

export type cliCommand = (
  argv: Array<string>,
  config: Config,
  model: FlowEditorModel,
) => Promise<void>;

const commands: {
  [command: string]: () => Promise<{ default: cliCommand }>;
} = {
  build: () => import('./commands/build'),
  start: () => import('./commands/start'),
  test: () => import('yoshi-flow-legacy/bin/yoshi-legacy'),
  lint: () => import('yoshi-flow-legacy/bin/yoshi-legacy'),
  info: () => import('yoshi-flow-legacy/bin/yoshi-legacy'),
  release: () => import('yoshi-flow-legacy/bin/yoshi-legacy'),
};

const args = arg(
  {
    // Types
    '--version': Boolean,
    '--help': Boolean,
    '--verbose': Boolean,

    // Aliases
    '-v': '--version',
    '-h': '--help',
  },
  {
    permissive: true,
  },
);

const foundCommand = Boolean(commands[args._[0]]);

if (!foundCommand && args['--help']) {
  console.log(`
    Usage
      $ yoshi-app <command>

      Available commands
      ${Object.keys(commands).join(', ')}

      Options
      --version, -v   Version number
      --inspect       Enable the Node.js inspector
      --help, -h      Displays this message

      For more information run a command with the --help flag
      $ yoshi-app build --help
  `);

  process.exit(0);
}

const command = foundCommand ? args._[0] : defaultCommand;
const forwardedArgs = foundCommand ? args._.slice(1) : args._;

if (args['--help']) {
  forwardedArgs.push('--help');
}

Promise.resolve().then(async () => {
  verifyNodeVersion();
  await verifyDependencies();

  if (command === 'start') {
    process.env.NODE_ENV = 'development';
    process.env.BABEL_ENV = 'development';

    normalizeDebuggingArgs();
  }

  if (command === 'build') {
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
  }

  const config = loadConfig();
  // This line is because the default ssl config is false,
  // and since we use yoshi-flow-legacy test command,
  // we need to configure ssl to true becase we did implement build and start commands
  // with ssl true as default (this should be removed when test cmd is implemented)
  config.servers.cdn.ssl = true;

  const model = await generateFlowEditorModel(config);

  const runCommand = (await commands[command]()).default;

  // legacy flow commands doen't need to be run
  if (typeof runCommand === 'function') {
    await runCommand(forwardedArgs, config, model);
  }
});
