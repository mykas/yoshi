import { useContext } from 'react';
import Experiments from '@wix/wix-experiments';
import { ExperimentsContext } from './ExperimentsProvider';

const useExperiments = (): Pick<Experiments, keyof Experiments> => {
  const experiments = useContext(ExperimentsContext) as Experiments;

  return {
    enabled: experiments.enabled.bind(experiments),
    add: experiments.add.bind(experiments),
    all: experiments.all.bind(experiments),
    conduct: experiments.conduct.bind(experiments),
    get: experiments.get.bind(experiments),
    load: experiments.load.bind(experiments),
    pending: experiments.pending.bind(experiments),
    ready: experiments.ready.bind(experiments),
    useNewApi: false,
  };
};

export default useExperiments;
