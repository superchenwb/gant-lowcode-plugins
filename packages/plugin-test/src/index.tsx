import React, { PureComponent } from 'react';
import { project } from '@gant-lowcode/lowcode-engine';
import { Button, Icon } from '@alifd/next';
import { PluginProps, IPublicTypeDisposable } from '@gant-lowcode/lowcode-types';

export interface IProps extends PluginProps {
  logo?: string;
}

export interface IState {
  undoEnable: boolean;
  redoEnable: boolean;
}

class Test extends PureComponent<IProps, IState> {
  static displayName = 'Test';

  private history: any;
  private changeDocumentDispose?: IPublicTypeDisposable;
  private changeStateDispose?: IPublicTypeDisposable;
  constructor(props: any) {
    super(props);
    this.state = {
      undoEnable: false,
      redoEnable: false,
    };
    this.init();
  }

  init = (): void => {
    this.changeDocumentDispose = project.onChangeDocument(doc => {
      this.history = doc.history;
      this.updateState(this.history?.getState() || 0);
      this.changeStateDispose?.();
      this.changeStateDispose = this.history.onChangeState(() => {
        this.updateState(this.history?.getState() || 0);
      });
    });
  };

  updateState = (state: number): void => {
    this.setState({
      undoEnable: !!(state & 1),
      redoEnable: !!(state & 2),
    });
  };

  handleUndoClick = (): void => {
    this.history.back();
  };

  handleRedoClick = (): void => {
    this.history.forward();
  };

  componentWillUnmount() {
    this.changeDocumentDispose?.();
    this.changeStateDispose?.();
  }

  render(): React.ReactNode {
    const { undoEnable, redoEnable } = this.state;
    return (
      <div className="lowcode-plugin-undo-redo">
        <Button
          size="medium"
          data-tip="撤销"
          data-dir="bottom"
          onClick={this.handleUndoClick}
          ghost
          disabled={!undoEnable}
        >
          <Icon type="houtui" />
        </Button>
        <Button
          size="medium"
          data-tip="恢复"
          data-dir="bottom"
          onClick={this.handleRedoClick}
          ghost
          disabled={!redoEnable}
        >
          <Icon type="qianjin" />
        </Button>
      </div>
    );
  }
}

const plugin = (ctx: any) => {
  return {
    // 插件名，注册环境下唯一
    name: 'PluginTest',
    // 依赖的插件（插件名数组）
    dep: [],
    // 插件的初始化函数，在引擎初始化之后会立刻调用
    init() {
      // 往引擎增加面板
      ctx.skeleton.add({
        area: 'topArea',
        type: 'Widget',
        name: 'undoRedo',
        content: Test,
        props: {
          align: 'right',
          width: 88,
        },
      })
    },
  };
};

plugin.pluginName = 'PluginTest'

export default plugin
