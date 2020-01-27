import React from 'react';

export default class Test extends React.Component {
  message = 'class-properties are working!';
  render() {
    return <div id="class-properties">{this.message}</div>;
  }
}
