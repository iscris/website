/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require("path");
const readline = require("readline");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-remove-empty-scripts");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const config = {
  entry: {
    scatter: [
      __dirname + "/js/tools/scatter/scatter.ts",
      __dirname + "/css/tools/scatter.scss",
    ],
    map: [
      __dirname + "/js/tools/map/map.ts",
      __dirname + "/css/tools/map.scss",
    ],
    stat_var: [
      __dirname + "/js/tools/stat_var/stat_var.ts",
      __dirname + "/css/tools/stat_var.scss",
    ],
    timeline: [
      __dirname + "/js/tools/timeline/timeline.ts",
      __dirname + "/css/tools/timeline.scss",
    ],
    queryStore: path.resolve(__dirname, "js/shared/stores/query_store.ts"),
    base: [__dirname + "/js/apps/base/main.ts", __dirname + "/css/core.scss"],
    place_landing: [
      __dirname + "/js/place/place_landing.ts",
      __dirname + "/css/place/place_landing.scss",
    ],
    place: [
      __dirname + "/js/place/place.ts",
      __dirname + "/css/place/place_page.scss",
    ],
    topic_page: [
      __dirname + "/js/apps/topic_page/main.ts",
      __dirname + "/css/topic_page.scss",
    ],
    explore_landing: [
      __dirname + "/js/apps/explore_landing/main.ts",
      __dirname + "/css/explore_landing.scss",
    ],
    explore: [
      __dirname + "/js/apps/explore/main.ts",
      __dirname + "/css/explore.scss",
    ],
    ranking: [
      __dirname + "/js/ranking/ranking.ts",
      __dirname + "/css/ranking.scss",
    ],
    browser: [
      __dirname + "/js/browser/browser.ts",
      __dirname + "/css/browser.scss",
    ],
    browser_landing: [
      __dirname + "/js/apps/browser_landing/main.ts",
      __dirname + "/css/browser_landing.scss",
    ],
    static: __dirname + "/css/static.scss",
    search: [
      __dirname + "/js/search/search.ts",
      __dirname + "/css/search.scss",
    ],
    download: [
      __dirname + "/js/tools/download/download.ts",
      __dirname + "/css/tools/download.scss",
    ],
    visualization: [
      __dirname + "/js/apps/visualization/main.ts",
      __dirname + "/css/tools/visualization.scss",
    ],
  },
  output: {
    path: path.resolve(__dirname, "../") + "/server/dist",
    filename: "[name].js",
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "css/",
              name: "[name].min.css",
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.IS_CLOUD_BUILD": JSON.stringify(
        process.env.IS_CLOUD_BUILD || "false"
      ),
    }),
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "css/**/*.css" },
        { from: "images/**/*" },
        { from: "fonts/*" },
        { from: "data/**/*" },
        { from: "sitemap/*.txt" },
        { from: "custom_dc/**/*" },
        { from: "*favicon.ico" },
        { from: "robots.txt" },
      ],
    }),
    new FixStyleOnlyEntriesPlugin({
      silent: true,
    }),
  ],
};

// Outputs webpack build progress in a single terminal line (if in a TTY environment).
const interactiveProgressHandler = (percentage, message, ...args) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  if (percentage === 1) {
    // When compilation is done, add a marker and an empty line.
    console.info("---------\n");
  } else {
    process.stdout.write(
      `webpack: ${Math.round(percentage * 100)}% ${message} ${args.join(" ")}`
    );
  }
};

// Supported modes are "development" and "production".
module.exports = (env, argv) => {
  console.log(`#### Building webpack in ${argv.mode} mode`);

  config.stats = {
    preset: "minimal",
    colors: true,
    errorDetails: true,
    logging: "warn",
  };

  // Add more logging and debugging options in development mode.
  if (argv.mode === "development") {
    config.devtool = "source-map";
    config.stats.preset = "log";

    if (process.env.IS_CLOUD_BUILD !== "true") {
      // Only log progress outside of cloud where it's useful to see the build starting.
      config.plugins.push(
        new webpack.ProgressPlugin(interactiveProgressHandler)
      );
    }
  }

  if (argv.mode !== "development" && process.env.WEBPACK_SPEED_MEASURE === "true") {
    const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
    return new SpeedMeasurePlugin().wrap(config);
  }
  return config;
};
