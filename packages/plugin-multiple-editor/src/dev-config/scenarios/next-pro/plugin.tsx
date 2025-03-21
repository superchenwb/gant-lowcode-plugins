import React from 'react';
import {
  plugins,
  skeleton,
  project,
  setters,
} from '@gant-lowcode/lowcode-engine';
import GantLowCodeEngineExt from '@gant-lowcode/lowcode-engine-ext';
import { Button } from '@alifd/next';
// import UndoRedoPlugin from '@gant-lowcode/lowcode-plugin-undo-redo';
import ComponentsPane from '@gant-lowcode/lowcode-plugin-components-pane';
import ZhEnPlugin from '@gant-lowcode/lowcode-plugin-zh-en';
// import DataSourcePanePlugin from '@gant-lowcode/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@gant-lowcode/lowcode-plugin-schema';
// import CodeEditor from '@gant-lowcode/lowcode-plugin-code-editor';
import ManualPlugin from '@gant-lowcode/lowcode-plugin-manual';
import Inject, { injectAssets } from '@alilc/lowcode-plugin-inject';
import SimulatorResizer from '@gant-lowcode/lowcode-plugin-simulator-select';

// 注册到引擎
import TitleSetter from '@alilc/lowcode-setter-title';
import BehaviorSetter from '../../setters/behavior-setter';
import CustomSetter from '../../setters/custom-setter';
import Logo from '../../sample-plugins/logo';
import { registerRefProp } from '../../sample-plugins/set-ref-prop';
import { deleteHiddenTransducer } from '../../sample-plugins/delete-hidden-transducer';

import {
  loadIncrementalAssets,
  getPageSchema,
  saveSchema,
  resetSchema,
  preview,
  getProjectSchemaFromLocalStorage,
} from '../../universal/utils';
import assets from './assets.json';
import schema from './schema.json';

export default async function registerPlugins() {
  await plugins.register(ManualPlugin);

  await plugins.register(Inject);

  await plugins.register(registerRefProp);

  await plugins.register(deleteHiddenTransducer);

  // plugin API 见 https://yuque.antfin.com/ali-lowcode/docs/cdukce
  SchemaPlugin.pluginName = 'SchemaPlugin';
  await plugins.register(SchemaPlugin);

  (SimulatorResizer as any).pluginName = 'SimulatorResizer';
  plugins.register(SimulatorResizer);

  const editorInit = (ctx: any) => {
    return {
      name: 'editor-init',
      async init() {
        // 修改面包屑组件的分隔符属性setter
        // const assets = await (
        //   await fetch(
        //     `https://alifd.alicdn.com/npm/@alilc/lowcode-materials/build/lowcode/assets-prod.json`
        //   )
        // ).json();
        // 设置物料描述
        const { material, project } = ctx;

        material.setAssets(await injectAssets(assets));

        // 加载 schema
        project.openDocument(
          getProjectSchemaFromLocalStorage('next-pro').componentsTree?.[0] ||
            schema
        );
      },
    };
  };
  editorInit.pluginName = 'editorInit';
  await plugins.register(editorInit);

  const builtinPluginRegistry = (ctx: any) => {
    return {
      name: 'builtin-plugin-registry',
      async init() {
        const { skeleton } = ctx;
        // 注册 logo 面板
        skeleton.add({
          area: 'topArea',
          type: 'Widget',
          name: 'logo',
          content: Logo,
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        // 注册组件面板
        const componentsPane = skeleton.add({
          area: 'leftArea',
          type: 'PanelDock',
          name: 'componentsPane',
          content: ComponentsPane,
          contentProps: {},
          props: {
            align: 'top',
            icon: 'zujianku',
            description: '组件库',
          },
        });
        componentsPane?.disable?.();
        project.onSimulatorRendererReady(() => {
          componentsPane?.enable?.();
        });
      },
    };
  };
  builtinPluginRegistry.pluginName = 'builtinPluginRegistry';
  await plugins.register(builtinPluginRegistry);

  // 设置内置 setter 和事件绑定、插件绑定面板
  const setterRegistry = (ctx: any) => {
    const { setterMap, pluginMap } = GantLowCodeEngineExt;
    return {
      name: 'ext-setters-registry',
      async init() {
        const { setters, skeleton } = ctx;
        // 注册setterMap
        setters.registerSetter(setterMap as any);
        // 注册插件
        // 注册事件绑定面板
        skeleton.add({
          area: 'centerArea',
          type: 'Widget',
          content: pluginMap.EventBindDialog,
          name: 'eventBindDialog',
          props: {},
        });

        // 注册变量绑定面板
        skeleton.add({
          area: 'centerArea',
          type: 'Widget',
          content: pluginMap.VariableBindDialog,
          name: 'variableBindDialog',
          props: {},
        });
      },
    };
  };
  setterRegistry.pluginName = 'setterRegistry';
  await plugins.register(setterRegistry);

  // 注册回退/前进
  // await plugins.register(UndoRedoPlugin);

  // 注册中英文切换
  await plugins.register(ZhEnPlugin);

  const loadAssetsSample = (ctx: any) => {
    return {
      name: 'loadAssetsSample',
      async init() {
        const { skeleton } = ctx;

        skeleton.add({
          name: 'loadAssetsSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
            width: 80,
          },
          content: (
            <Button onClick={loadIncrementalAssets}>异步加载资源</Button>
          ),
        });
      },
    };
  };
  loadAssetsSample.pluginName = 'loadAssetsSample';
  await plugins.register(loadAssetsSample);

  // 注册保存面板
  const saveSample = (ctx: any) => {
    return {
      name: 'saveSample',
      async init() {
        const { skeleton, hotkey } = ctx;

        skeleton.add({
          name: 'saveSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button onClick={() => saveSchema('next-pro')}>保存到本地</Button>
          ),
        });
        skeleton.add({
          name: 'resetSchema',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button onClick={() => resetSchema('next-pro')}>重置页面</Button>
          ),
        });
        hotkey.bind('command+s', (e) => {
          e.preventDefault();
          saveSchema('next-pro');
        });
      },
    };
  };
  saveSample.pluginName = 'saveSample';
  await plugins.register(saveSample);

  // DataSourcePanePlugin.pluginName = 'DataSourcePane';
  // await plugins.register(DataSourcePanePlugin);

  // CodeEditor.pluginName = 'CodeEditor';
  // await plugins.register(CodeEditor);

  const previewSample = (ctx: any) => {
    return {
      name: 'previewSample',
      async init() {
        const { skeleton } = ctx;
        skeleton.add({
          name: 'previewSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button type="primary" onClick={() => preview('next-pro')}>
              预览
            </Button>
          ),
        });
      },
    };
  };
  previewSample.pluginName = 'previewSample';
  await plugins.register(previewSample);

  const customSetter = (ctx: any) => {
    return {
      name: '___registerCustomSetter___',
      async init() {
        const { setters } = ctx;

        setters.registerSetter('TitleSetter', TitleSetter);
        setters.registerSetter('BehaviorSetter', BehaviorSetter);
        setters.registerSetter('CustomSetter', CustomSetter);
      },
    };
  };
  customSetter.pluginName = 'customSetter';
  await plugins.register(customSetter);
}
