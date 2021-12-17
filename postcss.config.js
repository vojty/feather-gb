module.exports = (config) => {
  const plugins = {
    tailwindcss: {},
    autoprefixer: {}
  }

  if (config.mode === 'production') {
    plugins.cssnano = {}
  }

  return {
    plugins
  }
}
