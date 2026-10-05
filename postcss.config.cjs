// Vite build doesn't work without this file
module.exports = () => {
  const plugins = {
    '@tailwindcss/postcss': {},
  }

  return {
    plugins,
  }
}
