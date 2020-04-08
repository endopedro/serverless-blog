// next.config.js
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const path = require('path')
const withPlugins = require('next-compose-plugins')
const webpack = require('webpack')

if (typeof require !== "undefined") {
  require.extensions[".less"] = () => { };
  require.extensions[".css"] = file => { };
}

const nextConfig = {
  exportPathMap: () => {
    return {
      '/': { page: '/' },
    };
  },
  webpack: (config, options) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components')
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        jquery: "jquery",
        "window.$": "jquery",
        "window.jQuery": "jquery",
        Popper: 'popper.js',
      })
    )
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    })
    return config;
  },
}

module.exports = withPlugins([
  [withSass],
  [withCSS],
], nextConfig);