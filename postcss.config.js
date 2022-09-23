// Vite build doesn't work without this file
module.exports = () => {
  const plugins = {
    tailwindcss: {},
    autoprefixer: {}
  }

  return {
    plugins
  }
}
