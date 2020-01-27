import { configure }  from 'yoshi-storybook-dependencies';

const loaders = require.context(PROJECT_ROOT, true, /\.stories\.(ts|tsx|js)$/);

// https://storybook.js.org/docs/basics/writing-stories/#loading-stories
configure(loaders, module);

