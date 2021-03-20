/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = (config) => {
  const plugins = [require('autoprefixer')]

  if (config.mode === 'production') {
    plugins.push(require('cssnano'))
  }

  return {
    plugins
  }
}
