var path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'portfolio'),
    filename: 'index.bundle.js'
  }
};