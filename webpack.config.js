import path from "node:path";

export default (env, argv) => ({
  target: "node",
  mode: argv.mode ?? "development",
  entry: "./src/server.js",
  output: { path: path.resolve("dist"), filename: "server.bundle.js" },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: "babel-loader" }],
  },
});