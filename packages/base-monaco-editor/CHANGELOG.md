# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.2](https://github.com/alibaba/lowcode-plugins/compare/v2.1.1...v2.1.2) (2024-12-02)


### Bug Fixes

* 修改less样式为css ([985412a](https://github.com/alibaba/lowcode-plugins/commit/985412aa861e13a5323de143d2965813e64835cb))
* 打包 ([c13fcf8](https://github.com/alibaba/lowcode-plugins/commit/c13fcf837acd4af488917225c8b37b2884333090))





# 2.1.0 (2024-11-25)


### Bug Fixes

* 🐛 修复数据源参数若干问题 ([ec47591](https://github.com/alibaba/lowcode-plugins/commit/ec4759101f2b5af808b7da88fd852f7418abd1a2))
* 修改包名 ([240b39c](https://github.com/alibaba/lowcode-plugins/commit/240b39ccf025ad26d79591764b2eaf772c0d9960))
* 修正 @alilc/lowcode-plugin-base-monaco-editor 的依赖 ([ad948bd](https://github.com/alibaba/lowcode-plugins/commit/ad948bd2d619ccfce0683143922b9a2c1060194b))
* 修正 bug ([0d9cec3](https://github.com/alibaba/lowcode-plugins/commit/0d9cec320747ed059aa36695c4a9f894b2437a5d))
* 修正 ve-code-editor 和 UIPaaS 的冲突 ([800f32e](https://github.com/alibaba/lowcode-plugins/commit/800f32e88b6963f6a5b18ccc0806d11b7f333a57))


### Features

* 补充 changelog ([262ab7b](https://github.com/alibaba/lowcode-plugins/commit/262ab7b274eedaaf6166b94f4da0b4eac7e36575))
* 添加 controller ([ff7a035](https://github.com/alibaba/lowcode-plugins/commit/ff7a0351eb46e5cb4e0bf776069e8b9a30373e4a))
* add overrideServices props ([151449c](https://github.com/alibaba/lowcode-plugins/commit/151449c5bb6dffd96b9bafb6db73c6f959e1cfb4))
* add worskapces plugins ([251534c](https://github.com/alibaba/lowcode-plugins/commit/251534cdff6075acfa071cb881e635c1e1fb68de))
* bump into next version ([b655d2d](https://github.com/alibaba/lowcode-plugins/commit/b655d2d77944c535fd27266f2a505d0fb0c61b52))
* bump into stable version ([e78fe80](https://github.com/alibaba/lowcode-plugins/commit/e78fe80a36dc5c6d30245f3054625d9abc5c506e))
* monaco单例化 ([58231ea](https://github.com/alibaba/lowcode-plugins/commit/58231ea663cdbb1726a05f0b19a0f32c66df93a7))
* support singleton mode / upgrade linkage ([598a43e](https://github.com/alibaba/lowcode-plugins/commit/598a43ef153a4e96998c1ff67bbd599d24b9eae0))





## 1.1.1

- 避免 UIPaaS 中的样式冲突，将 `.ve-code-control` 替换为 `.lc-code-control`

## 1.1.0

- Publish following changes

## 1.1.0-beta.3

- 去除 `overflow: visible` 样式，避免动作面板遮住按钮

## 1.1.0-beta.1

- 添加 controller 实例，可用作中间交换介质，解决与代码编辑相关的插件间的协作问题 [@wangshihao111](https://github.com/wangshihao111)
- 优化 Monaco 单例，元信息保存在 controller 实例内部 [@wangshihao111](https://github.com/wangshihao111)

## 1.1.0-beta.0

- 重构 type / path / value 联动，彻底修复 monaco 在多文件模式下覆盖多个 path 值的 bug
- 修复 ts 类型问题 [@wangshihao111](https://github.com/wangshihao111)
- 添加 configure 方法，支持配置是否开启 monaco 单例模式 [@wangshihao111](https://github.com/wangshihao111)
- 新增插件参数：`enhancers`，用于强化编辑器功能 [@wangshihao111](https://github.com/wangshihao111)

## 1.0.0

- Publish following changes

## 0.1.0-beta.15

- 补充文档

## 0.1.0-beta.13

- `supportFullScreen` 内部实现更新，改为 CSS 控制

## 0.1.0-beta.12

- 支持 `supportFullScreen` API，允许透出一个按钮，能够打开或退出全屏模式 

## 0.1.0-beta.11

- 修正 `path` 和 `value` 同时使用时，值设置滞后的 bug；注：因为值受控，此时 `saveViewState` 无效。配套可用的 API 是 `path`、`defaultValue`、`setViewState`
- style 支持 `'100px'` 等单位

## 0.1.0-beta.10

- 支持使用 `path` 来创建超过 1 个 model，以便通过 `saveViewState` 属性在切换不同 path 时，保存当前文件的撤回/重做/滚动条信息；

## 0.1.0-beta.9

- 加载后立即恢复全局 define，无论是否有 container API，避免冲突。（[Github Issue](https://github.com/microsoft/monaco-editor/issues/2283)）

## 1.0.0-beta.0

- bump into first version

## 0.1.0-beta.8

- 默认 options 调整

## 0.1.0-beta.7

- 支持 style 定制

## 0.1.0-beta.6

- 避免 monaco editor amd loader 和 webpack umd loader 的冲突。（[Github Issue](https://github.com/microsoft/monaco-editor/issues/2283)）

## 0.1.0-beta.5

- 避免 `window.MonacoEnvironment` 写死导致加载了错误版本的 worker

## 0.1.0-beta.4

- 对 containerRef 没有初始化成功的场景进行容错
- 修正 fowardRef 的报错

## 0.1.0-beta.3

- 内部实现使用 TypeScript + React Hooks 重写
- 升级 monaco-editor 的依赖到 0.31.1，可以使用 requireConfig 继续升级，形如：
```json
{
  "paths": {
    "vs": "https://g.alicdn.com/code/lib/monaco-editor/0.31.1/min/vs"
  }
}
```

- 使用 @monaco-editor/loader 优化加载
- editorDidMount 函数签名改为：`(monaco: IMonacoInstance, editor: IEditorInstance) => void;` 此前为 `(isFullsreen: boolean, editor: IEditorInstance, monaco: IMonacoInstance) => void;`
- API 下线
  - 简化 props 设计，所有的 options 都通过 options 传入。并内置默认的 options。影响的 API 包括：
    - mode: PropTypes.string,
    - value: PropTypes.string,
    - show: PropTypes.bool,
    - readOnly: PropTypes.bool,
    - fontSize: PropTypes.number,
    - lineNumbers: PropTypes.bool,
    - minimap: PropTypes.bool,
    - tabSize: PropTypes.number,
    - wordWrap: PropTypes.string,
  - 下线 suggestion 系列 API，可使用 monaco-editor 的对象进行操作。影响的 API 包括
    - enableSuggestion: PropTypes.bool,
    - defaultSuggestion: PropTypes.bool,
    - getCustomSuggestion: PropTypes.func,
    - diyWordSuggestion: PropTypes.bool,
  - 下线全屏相关 API
    - enableFullscreen: PropTypes.bool,
    - saveEditor: PropTypes.func,
  - 不再调用全局 API `onMonacoLoad`
  - 下线 enableBlurChange API
  - 下线 throttle API
  - 下线 checkSyntax API
  - 下线 onEditorDidMount API，使用 editorDidMount 替代
