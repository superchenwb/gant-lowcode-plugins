module.exports = {
  plugins: [
    'build-plugin-component',
    'build-plugin-fusion',
    [
      'build-plugin-moment-locales',
      {
        locales: ['zh-cn'],
      },
    ],
    [
      '@gant-lowcode/build-plugin-alt',
      {
        type: 'plugin',
        // 开启注入调试模式，see：https://www.yuque.com/lce/doc/ulvlkz
        inject: true,
        // 配置要打开的页面，在注入调试模式下，不配置此项的话不会打开浏览器
        // 支持直接使用官方 demo 项目：https://lowcode-engine.cn/demo/index.html
        openUrl: 'https://lowcode-engine.cn/demo/index.html?debug',
      },
    ],
  ],
};
