module.exports = {
  mode: 'production',
  output: {
    library: 'pdf2excel',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: ['babel-loader', 'eslint-loader'],
    }],
  },
};