import { project, event } from '@gant-lowcode/lowcode-engine';
import { IPublicTypePluginConfig, IPublicModelPluginContext } from '@gant-lowcode/lowcode-types';
import { controller as baseController } from '@gant-lowcode/lowcode-plugin-base-monaco-editor/es/controller';
import { EditorProvider } from './Context';
import MultipleFileEditor from './MultipleFileEditor';
import React from 'react';
import { EditorController, editorController } from './Controller';
import { EditorPluginInterface, Service } from './Service';
import { loadLess, loadPrettier } from './utils/script-loader';

export { editorController };

loadPrettier();
loadLess();

baseController.registerMethod('getSchema', () => {
  return editorController.getSchema();
});

const pluginCodeEditor = (
  options: {
    mode?: 'single' | 'multiple';
    es6?: boolean;
    softSave?: boolean;
    onInstall?: (controller: EditorController) => void;
    plugins?: EditorPluginInterface[];
    defaultFiles?: Record<string, string>;
    useLess?: boolean;
  } = {}
) => {
  const plugin = (ctx: IPublicModelPluginContext): IPublicTypePluginConfig => {
    return {
      exports: () => ({}),
      init() {
        options.onInstall?.(editorController);
        editorController.es6 = options.es6;
        editorController.useLess = options.useLess;
        editorController.defaultFiles = options.defaultFiles || {};
        const schemaDock = ctx.skeleton.add({
          area: 'leftArea',
          name: 'codeEditor',
          type: 'PanelDock',
          props: {
            icon: (
              <svg
                fill="currentColor"
                preserveAspectRatio="xMidYMid meet"
                width="20"
                height="20"
                viewBox="0 0 1024 1024"
              >
                <path d="M726.4 515.2c-12.8-6.4-41.6-16-83.2-28.8-28.8-9.6-48-16-54.4-19.2-16-6.4-22.4-19.2-22.4-32 0-16 6.4-25.6 19.2-32 9.6-6.4 25.6-9.6 44.8-9.6 22.4 0 41.6 3.2 54.4 12.8 12.8 9.6 19.2 22.4 25.6 41.6h51.2c-3.2-35.2-16-57.6-38.4-73.6-22.4-16-51.2-22.4-89.6-22.4-35.2 0-64 6.4-86.4 22.4-25.6 16-35.2 38.4-35.2 64s12.8 48 35.2 60.8c9.6 6.4 35.2 12.8 73.6 25.6 35.2 9.6 54.4 16 60.8 19.2 19.2 9.6 28.8 22.4 28.8 38.4 0 12.8-6.4 22.4-19.2 32-12.8 6.4-32 12.8-54.4 12.8-25.6 0-44.8-3.2-57.6-12.8-12.8-9.6-22.4-25.6-25.6-51.2h-51.2c3.2 38.4 16 67.2 44.8 86.4 22.4 16 54.4 22.4 92.8 22.4 41.6 0 73.6-9.6 96-22.4 22.4-16 32-38.4 32-64 0-32-12.8-54.4-41.6-70.4zM406.4 563.2c0 22.4-3.2 38.4-12.8 48-9.6 9.6-22.4 16-38.4 16-32 0-48-19.2-48-54.4v-9.6H256v12.8c0 28.8 9.6 54.4 25.6 70.4 16 16 41.6 25.6 73.6 25.6 38.4 0 64-9.6 80-25.6s22.4-41.6 22.4-80v-208h-51.2v204.8z" />
                <path d="M896 128H128c-35.2 0-64 28.8-64 64v640c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64z m0 672c0 16-12.8 32-32 32H160c-19.2 0-32-16-32-32V224c0-16 12.8-32 32-32h704c19.2 0 32 16 32 32v576z" />
              </svg>
            ),
            description: '源码面板',
          },
          panelProps: {
            width: '848px',
            title: '源码面板',
          },
          content: (
            <EditorProvider softSave={options.softSave} mode={options.mode}>
              <MultipleFileEditor />
            </EditorProvider>
          ),
        }) as any;

        schemaDock && schemaDock.disable();
        project.onSimulatorRendererReady(() => {
          schemaDock.enable();
          const finalEditor = event;
          const service = new Service(editorController, ctx.skeleton);
          service.init({ plugins: options.plugins });
          editorController.init(project, finalEditor, service);
        });
      },
    };
  };
  plugin.pluginName = 'codeEditor';
  return plugin;
};

export default pluginCodeEditor;
