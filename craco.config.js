const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#ff4d4f", // Cambia el color principal
              "@font-size-base": "16px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  babel: {
    presets: [],
    plugins: [],
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((loader) => {
            if (loader.loader && loader.loader.includes("style-loader")) {
              loader.loader = require.resolve("css-loader");
            }
          });
        }
      });
      return webpackConfig;
    },
  }
};