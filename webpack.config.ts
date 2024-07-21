// @ts-check
const path = require('path')

module.exports = /** @type { import('webpack').Configuration } */ {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    library: {
      name: 'reacti18n',
      type: 'umd',
      umdNamedDefine: true,
    },
    path: path.resolve(__dirname, 'browser'),
    filename: 'reacti18n-browser.min.js',
  },
  externals: {
    'node:fs': '{}',
  },
  resolve: {
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
    ],
  },
}
