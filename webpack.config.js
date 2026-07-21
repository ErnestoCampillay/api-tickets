const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    target: "node",
    entry: "./src/server.js", // 👈 ¡Aquí estaba el detalle!
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "server.bundle.js",
      clean: true,
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "eval-source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  };
};
