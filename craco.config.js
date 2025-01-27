const CracoLessPlugin = require("craco-less");
const { whenDev } = require("@craco/craco")

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
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf = rule.oneOf.filter((loader) => {
            if (loader.loader && loader.loader.includes("style-loader")) {
              return process.env.NODE_ENV !== "production";
            }
            return true;
          });
        }
      });
      return webpackConfig;
    },
  }
};