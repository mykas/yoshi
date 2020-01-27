import React from 'react';
import { PublicDataContext, PublicDataType } from './PublicDataContext';

// Later it can be passed into a hook as `usePublicData(scope)`
const scope = 'COMPONENT';

export interface PublicDataProviderViewerProps {
  data: Record<string, any>;
}

export class PublicDataProviderViewer extends React.Component<
  PublicDataProviderViewerProps
> {
  handleGetParam = (key: string): any => {
    try {
      return this.props.data[scope][key];
    } catch (e) {
      console.error(new Error(`key "${key}" wasn't found on public data:`));
      console.error(e);
      return undefined;
    }
  };

  state = {
    value: {
      get: this.handleGetParam,
      set: () => {
        throw new Error(`you can't edit public data on viewer mode`);
      },
      ready: true,
      readyPromise: Promise.resolve(true),
      type: 'viewer-public-data' as PublicDataType,
    },
  };

  render() {
    return (
      <PublicDataContext.Provider value={this.state.value}>
        {this.props.children}
      </PublicDataContext.Provider>
    );
  }
}
