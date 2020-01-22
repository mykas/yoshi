import t from './template';

type Opts = Record<'settingsWrapperPath' | 'componentFileName', string>;

export default t<Opts>`
  import React from 'react';
  import ReactDOM from 'react-dom';
  import SettingsWrapper from '${({ settingsWrapperPath }) =>
    settingsWrapperPath}';
  import Settings from '${({ componentFileName }) => componentFileName}';

  ReactDOM.render(React.createElement(SettingsWrapper, null, React.createElement(Settings)), document.getElementById('root'));
`;
