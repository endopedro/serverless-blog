// next.config.js
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const path = require('path')
const withPlugins = require('next-compose-plugins')
const webpack = require('webpack')
require('dotenv').config()

if (typeof require !== "undefined") {
  require.extensions[".less"] = () => { };
  require.extensions[".css"] = file => { };
}

const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    WEB_URI: process.env.WEB_URI,
  },
  exportPathMap: () => {
    return {
      '/': { page: '/' },
    };
  },
  webpack: (config, options) => {
    config.node = {
      dns: 'empty',
      fs: 'empty',
      module: 'empty',
      net: 'empty',
      tls: 'empty',
      'mongodb-client-encryption': 'empty'
    }
    config.resolve.alias['@lib'] = path.join(__dirname, 'lib')
    config.resolve.alias['@middlewares'] = path.join(__dirname, 'middlewares')
    config.resolve.alias['@components'] = path.join(__dirname, 'components')
    config.resolve.alias['@assets'] = path.join(__dirname, 'assets')
    config.resolve.alias['@pages'] = path.join(__dirname, 'pages')
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
        },
      }
    })
    return config;
  },
}

module.exports = withPlugins([
  [withSass],
  [withCSS],
], nextConfig);