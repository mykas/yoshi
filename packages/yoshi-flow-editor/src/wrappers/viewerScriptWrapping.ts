import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel, ComponentModel } from '../model';
import controllerEntry from './templates/ControllerEntryContent';

const viewerScriptWrapperPath =
  'yoshi-flow-editor-runtime/build/viewerScript.js';

const viewerScriptWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.components.reduce(
    (acc: Record<string, string>, component: ComponentModel) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${component.name}ViewerScript.js`,
      );

      const generateControllerEntryContent = controllerEntry({
        viewerScriptWrapperPath,
        controllerFileName: component.controllerFileName,
        initAppPath: model.initApp,
      });

      fs.outputFileSync(
        generatedWidgetEntryPath,
        generateControllerEntryContent,
      );

      acc[`${component.name}ViewerScript`] = generatedWidgetEntryPath;
      acc[`${component.name}Controller`] = component.controllerFileName;

      return acc;
    },
    {},
  );
};

export default viewerScriptWrapper;
