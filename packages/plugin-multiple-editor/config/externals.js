module.exports = function (webpackEnv) {
  const isEnvProduction = webpackEnv === 'production';

  return isEnvProduction ? {
    'react': 'react',
    'react-dom': 'react-dom',
    '@gant-lowcode/lowcode-engine': '@gant-lowcode/lowcode-engine',
    '@gant-lowcode/lowcode-engine-ext': '@gant-lowcode/lowcode-engine-ext',
    '@alifd/next': '@alifd/next',
    'prettier/esm/standalone.mjs': 'prettier/esm/standalone.mjs',
  } : {
    'react': 'React',
    'react-dom': 'ReactDOM',
    '@gant-lowcode/lowcode-engine': 'GantLowCodeEngine',
    '@gant-lowcode/lowcode-engine-ext': 'GantLowCodeEngineExt',
    '@alifd/next': 'Next',
    'prettier/esm/standalone.mjs': 'prettier',
  }
}