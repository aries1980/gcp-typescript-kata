const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ['./src/index.ts'],
  target: 'node',
  // exclude external node modules and builtin packages (ie: aws-sdk)
  externals: [
    nodeExternals({
      // add here libs that need to be bundled with the functions
      whitelist: ['express', '@google-cloud/storage'],
      // Read the modules from the package.json file instead of the node_modules folder.
      modulesFromFile: true,
    }),
  ],
  stats: 'minimal',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'src/index.js',
  },
  plugins: [new CleanWebpackPlugin(['.webpack'])],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
