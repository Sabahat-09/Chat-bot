const rspack = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");

/** @type {import("@rspack/cli").Configuration} */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    refresh: true,
                  },
                },
              },
            },
          },
        ],
        type: "javascript/auto",
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./public/index.html",
    }),
    new ReactRefreshPlugin(),
    new rspack.DefinePlugin({
      "process.env.API_URL": JSON.stringify(process.env.API_URL || "http://localhost:8000"),
      "process.env.WS_URL": JSON.stringify(process.env.WS_URL || "ws://localhost:8000/ws/chat"),
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};

